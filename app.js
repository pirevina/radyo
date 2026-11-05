/**
 * RADYO KIRKYAMA - BOĞAZİÇİ KOLEJİ
 * Saf Vanilla JavaScript Müzik Motoru & Kullanıcı Arayüzü
 * Desteklenen Teknolojiler: Telegram MTProto Stream, Media Session API, PWA Service Worker
 */

(function () {
  'use strict';

  // ==========================================================================
  // UYGULAMA DURUMU (APP STATE)
  // ==========================================================================
  const state = {
    allSongs: [],
    filteredSongs: [],
    currentIndex: -1,
    currentSong: null,
    isPlaying: false,
    isShuffle: false,
    repeatMode: 'off', // 'off' | 'all' | 'one'
    queue: [],
    favorites: new Set(JSON.parse(localStorage.getItem('kirkyama_favs') || '[]')),
    currentCategory: 'all',
    searchQuery: '',
    currentView: 'discover', // 'discover' | 'favorites' | 'queue-mobile'
    playbackSpeed: 1,
    speedOptions: [0.75, 1, 1.25, 1.5, 2],
    volume: parseFloat(localStorage.getItem('kirkyama_volume') || '0.85'),
    isMuted: false,
    streamServerUrl: localStorage.getItem('kirkyama_server_url') || 'http://localhost:3001',
    playMode: localStorage.getItem('kirkyama_play_mode') || 'auto', // 'auto' | 'serverOnly' | 'demoOnly'
    deferredPrompt: null,
    isUsingFallback: false
  };

  // ==========================================================================
  // DOM ELEMENTLERİ
  // ==========================================================================
  const audio = document.getElementById('audioEngine');
  
  // Oynatıcı Elementleri
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playSvg = playPauseBtn.querySelector('.play-svg');
  const pauseSvg = playPauseBtn.querySelector('.pause-svg');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const repeatBtn = document.getElementById('repeatBtn');
  const repeatOneIndicator = document.getElementById('repeatOneIndicator');
  
  const progressBarContainer = document.getElementById('progressBarContainer');
  const progressPlayed = document.getElementById('progressPlayed');
  const progressBuffered = document.getElementById('progressBuffered');
  const progressSeek = document.getElementById('progressSeek');
  const currentTimeEl = document.getElementById('currentTime');
  const totalDurationEl = document.getElementById('totalDuration');

  const playerCover = document.getElementById('playerCover');
  const playerTitle = document.getElementById('playerTitle');
  const playerArtist = document.getElementById('playerArtist');
  const playerFavBtn = document.getElementById('playerFavBtn');
  const trackSoundWave = document.getElementById('trackSoundWave');

  const volumeBtn = document.getElementById('volumeBtn');
  const volumeHighIcon = document.getElementById('volumeHighIcon');
  const volumeMuteIcon = document.getElementById('volumeMuteIcon');
  const volumeSlider = document.getElementById('volumeSlider');
  const playbackSpeedBtn = document.getElementById('playbackSpeedBtn');

  // Sayfa Elementleri
  const songListEl = document.getElementById('songList');
  const emptyStateEl = document.getElementById('emptyState');
  const songCountEl = document.getElementById('songCount');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const favCountBadge = document.getElementById('favCountBadge');
  const queueCountBadge = document.getElementById('queueCountBadge');
  const playAllBtn = document.getElementById('playAllBtn');

  // Hero Elementleri
  const heroBanner = document.getElementById('heroBanner');
  const heroTitle = document.getElementById('heroTitle');
  const heroDesc = document.getElementById('heroDesc');
  const heroCover = document.getElementById('heroCover');
  const heroPlayBtn = document.getElementById('heroPlayBtn');
  const heroQueueBtn = document.getElementById('heroQueueBtn');

  // Çekmece & Sidebar
  const sidebar = document.getElementById('sidebar');
  const openSidebarBtn = document.getElementById('openSidebarBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const queueDrawer = document.getElementById('queueDrawer');
  const toggleQueueBtn = document.getElementById('toggleQueueBtn');
  const closeQueueBtn = document.getElementById('closeQueueBtn');
  const clearQueueBtn = document.getElementById('clearQueueBtn');
  const queueDrawerBadge = document.getElementById('queueDrawerBadge');
  const queueNowPlaying = document.getElementById('queueNowPlaying');
  const queueItemsList = document.getElementById('queueItemsList');

  // Sunucu Durumu & Ayarlar
  const serverStatusIndicator = document.getElementById('serverStatusIndicator');
  const serverStatusTitle = document.getElementById('serverStatusTitle');
  const serverStatusSub = document.getElementById('serverStatusSub');
  const serverSettingsBtn = document.getElementById('serverSettingsBtn');
  const serverSettingsModal = document.getElementById('serverSettingsModal');
  const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const serverUrlInput = document.getElementById('serverUrlInput');
  const testServerBtn = document.getElementById('testServerBtn');
  const serverTestResult = document.getElementById('serverTestResult');

  // PWA Yükleme
  const installPwaBtn = document.getElementById('installPwaBtn');
  const toastContainer = document.getElementById('toastContainer');

  // ==========================================================================
  // BAŞLATMA & ŞARKI VERİLERİNİ YÜKLEME
  // ==========================================================================
  async function init() {
    setupEventListeners();
    setupMediaSession();
    registerServiceWorker();
    initAudioEngine();
    updateFavBadge();

    try {
      const response = await fetch('./songs.json');
      state.allSongs = await response.json();
      state.filteredSongs = [...state.allSongs];
      
      // İlk şarkıyı Hero kartına yerleştir
      if (state.allSongs.length > 0) {
        setupHero(state.allSongs[0]);
      }

      renderSongList();
      checkServerHealthQuiet();
    } catch (err) {
      console.error('Şarkı listesi yüklenemedi:', err);
      showToast('Şarkı listesi yüklenirken bir hata oluştu.', 'error');
    }
  }

  // ==========================================================================
  // AUDIO ENGINE VE TELEGRAM STREAM MANTIĞI
  // ==========================================================================
  function initAudioEngine() {
    audio.volume = state.volume;
    volumeSlider.value = state.volume;

    // Zaman güncellemesi
    audio.addEventListener('timeupdate', () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressPlayed.style.width = `${percent}%`;
        progressSeek.value = percent;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalDurationEl.textContent = formatTime(audio.duration);
        updateMediaSessionPosition();
      }
    });

    // Buffer ilerleme kontrolü
    audio.addEventListener('progress', () => {
      if (audio.buffered.length > 0 && !isNaN(audio.duration)) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const percent = (bufferedEnd / audio.duration) * 100;
        progressBuffered.style.width = `${percent}%`;
      }
    });

    // Şarkı bittiğinde
    audio.addEventListener('ended', () => {
      if (state.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(e => console.error(e));
      } else {
        playNextSong();
      }
    });

    // Çalma başladı
    audio.addEventListener('play', () => {
      state.isPlaying = true;
      updatePlayPauseUI(true);
      trackSoundWave.classList.add('active');
      renderPlayingState();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    });

    // Duraklatıldı
    audio.addEventListener('pause', () => {
      state.isPlaying = false;
      updatePlayPauseUI(false);
      trackSoundWave.classList.remove('active');
      renderPlayingState();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    });

    // Ses hatası olduğunda Akıllı Fallback
    audio.addEventListener('error', (e) => {
      console.warn('[Audio Hatası]:', audio.error, 'Kaynak:', audio.src);
      
      // Eğer stream server denendiyse ve hata alındıysa demo sese dön
      if (!state.isUsingFallback && state.currentSong && state.currentSong.demoAudio && state.playMode !== 'serverOnly') {
        console.log('[Fallback Devrede] Yerel demo ses kaynağına geçiliyor...');
        state.isUsingFallback = true;
        audio.src = state.currentSong.demoAudio;
        audio.play().then(() => {
          showToast('Telegram sunucusuna ulaşılamadı. Demo ses kaynağı çalınıyor.', 'info');
        }).catch(err => {
          console.error('Demo ses de açılamadı:', err);
        });
      } else {
        showToast('Parça yüklenirken ses hatası oluştu.', 'error');
        updatePlayPauseUI(false);
      }
    });
  }

  // ==========================================================================
  // ŞARKI YÜKLEME VE ÇALMA
  // ==========================================================================
  function playSong(song, autoPlay = true) {
    if (!song) return;

    state.currentSong = song;
    state.currentIndex = state.allSongs.findIndex(s => s.id === song.id);
    state.isUsingFallback = false;

    // Ses Kaynak URL'sini Belirle
    let audioSrc = '';
    const serverUrl = state.streamServerUrl.replace(/\/+$/, '');

    if (state.playMode === 'demoOnly') {
      audioSrc = song.demoAudio || '';
    } else if (state.playMode === 'serverOnly') {
      audioSrc = `${serverUrl}/stream/${song.messageId}`;
    } else {
      // 'auto' mod: Stream server url'i varsa öncelikli olarak dene
      if (serverUrl && song.messageId) {
        audioSrc = `${serverUrl}/stream/${song.messageId}`;
      } else {
        audioSrc = song.demoAudio;
        state.isUsingFallback = true;
      }
    }

    audio.src = audioSrc;
    audio.playbackRate = state.playbackSpeed;

    // Alt Player UI Güncelle
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    playerCover.src = song.cover;
    currentTimeEl.textContent = '00:00';
    totalDurationEl.textContent = song.duration || '00:00';
    progressPlayed.style.width = '0%';
    progressBuffered.style.width = '0%';
    progressSeek.value = 0;

    // Favori Durumu
    updatePlayerFavButton();

    // Kuyruk Drawer UI Güncelle
    renderQueueNowPlaying();

    // Media Session Güncelle
    updateMediaSessionMetadata(song);

    if (autoPlay) {
      audio.play().catch(err => {
        console.warn('Otomatik oynatma tarayıcı politikasına takıldı veya kaynak yükleniyor:', err);
      });
    }

    renderPlayingState();
  }

  function togglePlayPause() {
    if (!state.currentSong) {
      // Eğer henüz hiç şarkı seçilmediyse listedeki ilk şarkıyı çal
      if (state.filteredSongs.length > 0) {
        playSong(state.filteredSongs[0], true);
      }
      return;
    }

    if (audio.paused) {
      audio.play().catch(e => console.error('Play hatası:', e));
    } else {
      audio.pause();
    }
  }

  function playNextSong() {
    // 1. Manuel Kuyrukta (Queue) şarkı var mı?
    if (state.queue.length > 0) {
      const nextFromQueue = state.queue.shift();
      updateQueueUI();
      playSong(nextFromQueue, true);
      return;
    }

    // 2. Karışık Çal (Shuffle) Aktif mi?
    const list = state.filteredSongs.length > 0 ? state.filteredSongs : state.allSongs;
    if (list.length === 0) return;

    if (state.isShuffle) {
      const randomIndex = Math.floor(Math.random() * list.length);
      playSong(list[randomIndex], true);
      return;
    }

    // 3. Sıradaki Şarkı
    const currentListIndex = list.findIndex(s => s.id === (state.currentSong ? state.currentSong.id : -1));
    let nextIndex = currentListIndex + 1;

    if (nextIndex >= list.length) {
      if (state.repeatMode === 'all') {
        nextIndex = 0; // Başa dön
      } else {
        // Liste bitti, dur
        audio.pause();
        return;
      }
    }

    playSong(list[nextIndex], true);
  }

  function playPrevSong() {
    // Şarkının 3. saniyesinden sonraysa başa sar
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    const list = state.filteredSongs.length > 0 ? state.filteredSongs : state.allSongs;
    if (list.length === 0) return;

    const currentListIndex = list.findIndex(s => s.id === (state.currentSong ? state.currentSong.id : -1));
    let prevIndex = currentListIndex - 1;

    if (prevIndex < 0) {
      prevIndex = list.length - 1;
    }

    playSong(list[prevIndex], true);
  }

  function updatePlayPauseUI(playing) {
    if (playing) {
      playSvg.style.display = 'none';
      pauseSvg.style.display = 'block';
    } else {
      playSvg.style.display = 'block';
      pauseSvg.style.display = 'none';
    }
  }

  // ==========================================================================
  // ŞARKI LİSTESİ VE GÖRÜNÜM RENDER ETME
  // ==========================================================================
  function renderSongList() {
    songListEl.innerHTML = '';

    let listToRender = state.filteredSongs;

    if (state.currentView === 'favorites') {
      listToRender = state.allSongs.filter(s => state.favorites.has(s.id));
    }

    songCountEl.textContent = listToRender.length;

    if (listToRender.length === 0) {
      emptyStateEl.style.display = 'block';
      return;
    }
    emptyStateEl.style.display = 'none';

    listToRender.forEach((song, index) => {
      const isCurrent = state.currentSong && state.currentSong.id === song.id;
      const isLiked = state.favorites.has(song.id);

      const row = document.createElement('div');
      row.className = `song-row ${isCurrent ? 'playing' : ''}`;
      row.dataset.id = song.id;

      row.innerHTML = `
        <div class="col-num">
          <span class="row-index">${index + 1}</span>
          <svg class="row-play-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          <div class="row-playing-bars">
            <span></span><span></span><span></span>
          </div>
        </div>
        
        <div class="col-title">
          <img src="${song.cover}" alt="${song.title}" class="row-cover" loading="lazy">
          <div class="row-info">
            <span class="row-title">${song.title}</span>
            <span class="row-artist">${song.artist}</span>
          </div>
        </div>

        <div class="col-album">${song.album || 'Tekli'}</div>

        <div class="col-category">
          <span class="cat-tag">${song.categoryTitle || 'Müzik'}</span>
        </div>

        <div class="col-time">${song.duration || '03:00'}</div>

        <div class="col-action">
          <button class="row-action-btn ${isLiked ? 'liked' : ''}" data-action="favorite" title="Favorilere Ekle/Çıkar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked ? '#ef4444' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button class="row-action-btn" data-action="queue" title="Sıraya Ekle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      `;

      // Satıra tıklama (Play)
      row.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.row-action-btn');
        if (actionBtn) {
          const action = actionBtn.dataset.action;
          if (action === 'favorite') {
            e.stopPropagation();
            toggleFavorite(song.id);
          } else if (action === 'queue') {
            e.stopPropagation();
            addToQueue(song);
          }
          return;
        }

        // Eğer zaten çalan şarkıysa play/pause yap
        if (isCurrent) {
          togglePlayPause();
        } else {
          playSong(song, true);
        }
      });

      songListEl.appendChild(row);
    });
  }

  function renderPlayingState() {
    const rows = songListEl.querySelectorAll('.song-row');
    rows.forEach(r => {
      const id = parseInt(r.dataset.id, 10);
      if (state.currentSong && state.currentSong.id === id) {
        r.classList.add('playing');
      } else {
        r.classList.remove('playing');
      }
    });
  }

  // ==========================================================================
  // HERO KARTI VE ETKİLEŞİMLER
  // ==========================================================================
  function setupHero(song) {
    if (!song) return;
    heroTitle.textContent = song.title;
    heroDesc.textContent = `${song.artist} &bull; ${song.album || 'Özel Seçki'} — Boğaziçi Koleji ${song.categoryTitle || 'Kolej Kuşağı'}`;
    heroCover.src = song.cover;

    heroPlayBtn.onclick = () => {
      playSong(song, true);
    };

    heroQueueBtn.onclick = () => {
      addToQueue(song);
    };
  }

  // ==========================================================================
  // ŞARKI KUYRUĞU (UP NEXT DRAWER)
  // ==========================================================================
  function addToQueue(song) {
    state.queue.push(song);
    updateQueueUI();
    showToast(`"${song.title}" sıraya eklendi.`, 'success');
  }

  function updateQueueUI() {
    queueCountBadge.textContent = state.queue.length;
    queueDrawerBadge.textContent = state.queue.length;

    renderQueueNowPlaying();
    renderQueueItems();
  }

  function renderQueueNowPlaying() {
    if (!state.currentSong) {
      queueNowPlaying.innerHTML = '<div style="font-size:0.8rem; color:var(--text-muted);">Şu an çalan parça yok</div>';
      return;
    }
    const song = state.currentSong;
    queueNowPlaying.innerHTML = `
      <div class="queue-np-card">
        <img src="${song.cover}" alt="${song.title}" class="queue-np-cover">
        <div class="queue-np-info">
          <div class="queue-np-tag">ŞU AN ÇALIYOR</div>
          <div class="queue-np-title">${song.title}</div>
          <div class="queue-np-artist">${song.artist}</div>
        </div>
      </div>
    `;
  }

  function renderQueueItems() {
    queueItemsList.innerHTML = '';
    if (state.queue.length === 0) {
      queueItemsList.innerHTML = '<div style="font-size:0.82rem; color:var(--text-muted); padding:16px 0; text-align:center;">Sırada bekleyen şarkı yok. Şarkı listesindeki (+) ikonuna basarak sıraya ekleyebilirsiniz.</div>';
      return;
    }

    state.queue.forEach((song, idx) => {
      const item = document.createElement('div');
      item.className = 'queue-item';
      item.innerHTML = `
        <img src="${song.cover}" alt="${song.title}" class="queue-item-cover">
        <div class="queue-item-meta">
          <div class="queue-item-title">${song.title}</div>
          <div class="queue-item-artist">${song.artist}</div>
        </div>
        <button class="queue-item-remove" title="Sıradan Kaldır">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;

      item.querySelector('.queue-item-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        state.queue.splice(idx, 1);
        updateQueueUI();
      });

      item.addEventListener('click', () => {
        // Tıklananı sıradan çıkarıp hemen çal
        state.queue.splice(idx, 1);
        updateQueueUI();
        playSong(song, true);
      });

      queueItemsList.appendChild(item);
    });
  }

  // ==========================================================================
  // FAVORİLER YÖNETİMİ
  // ==========================================================================
  function toggleFavorite(songId) {
    if (state.favorites.has(songId)) {
      state.favorites.delete(songId);
      showToast('Favorilerden çıkarıldı.', 'info');
    } else {
      state.favorites.add(songId);
      showToast('Favorilere eklendi!', 'success');
    }

    localStorage.setItem('kirkyama_favs', JSON.stringify([...state.favorites]));
    updateFavBadge();
    updatePlayerFavButton();
    renderSongList();
  }

  function updateFavBadge() {
    favCountBadge.textContent = state.favorites.size;
  }

  function updatePlayerFavButton() {
    if (state.currentSong && state.favorites.has(state.currentSong.id)) {
      playerFavBtn.classList.add('active');
    } else {
      playerFavBtn.classList.remove('active');
    }
  }

  // ==========================================================================
  // CANLI FİLTRELEME VE ARAMA
  // ==========================================================================
  function filterSongs() {
    const query = state.searchQuery.trim().toLocaleLowerCase('tr');
    const category = state.currentCategory;

    state.filteredSongs = state.allSongs.filter(song => {
      // Kategori kontrolü
      const matchCategory = (category === 'all') || (song.category === category);
      
      // Arama kontrolü
      const title = (song.title || '').toLocaleLowerCase('tr');
      const artist = (song.artist || '').toLocaleLowerCase('tr');
      const album = (song.album || '').toLocaleLowerCase('tr');
      const matchQuery = !query || title.includes(query) || artist.includes(query) || album.includes(query);

      return matchCategory && matchQuery;
    });

    renderSongList();
  }

  // ==========================================================================
  // MEDIA SESSION API (KİLİT EKRANI & BİLDİRİM ÇUBUĞU ENTEGRASYONU)
  // ==========================================================================
  function setupMediaSession() {
    if (!('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.setActionHandler('play', () => {
        togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        playPrevSong();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        playNextSong();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime && !isNaN(audio.duration)) {
          audio.currentTime = details.seekTime;
        }
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skip = details.seekOffset || 10;
        audio.currentTime = Math.max(audio.currentTime - skip, 0);
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skip = details.seekOffset || 10;
        audio.currentTime = Math.min(audio.currentTime + skip, audio.duration || 0);
      });
    } catch (err) {
      console.warn('MediaSession handler ataması sırasında uyarı:', err);
    }
  }

  function updateMediaSessionMetadata(song) {
    if (!('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: `${song.artist} (Boğaziçi Koleji)`,
        album: song.album || 'Radyo Kırkyama',
        artwork: [
          { src: song.cover, sizes: '96x96', type: 'image/jpeg' },
          { src: song.cover, sizes: '128x128', type: 'image/jpeg' },
          { src: song.cover, sizes: '192x192', type: 'image/jpeg' },
          { src: song.cover, sizes: '512x512', type: 'image/jpeg' }
        ]
      });
    } catch (e) {
      console.warn('MediaSession Metadata atanamadı:', e);
    }
  }

  function updateMediaSessionPosition() {
    if (!('mediaSession' in navigator) || !('setPositionState' in navigator.mediaSession)) return;
    try {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          playbackRate: audio.playbackRate,
          position: audio.currentTime
        });
      }
    } catch (e) {
      // Bazen rapid timeupdate'larda micro-error olabilir, sessiz geç
    }
  }

  // ==========================================================================
  // PWA SERVICE WORKER
  // ==========================================================================
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => {
            console.log('[PWA] Service Worker kaydedildi. Kapsam:', reg.scope);
          })
          .catch(err => {
            console.warn('[PWA] Service Worker kaydı başarısız:', err);
          });
      });
    }

    // PWA Kurulum İstemi (BeforeInstallPrompt)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredPrompt = e;
      installPwaBtn.style.display = 'inline-flex';
    });

    installPwaBtn.addEventListener('click', async () => {
      if (!state.deferredPrompt) return;
      state.deferredPrompt.prompt();
      const { outcome } = await state.deferredPrompt.userChoice;
      console.log(`[PWA] Kurulum sonucu: ${outcome}`);
      state.deferredPrompt = null;
      installPwaBtn.style.display = 'none';
    });
  }

  // ==========================================================================
  // SUNUCU SAĞLIK KONTROLÜ
  // ==========================================================================
  async function checkServerHealthQuiet() {
    if (state.playMode === 'demoOnly') {
      updateServerStatusUI('demo');
      return;
    }

    const serverUrl = state.streamServerUrl.replace(/\/+$/, '');
    try {
      const res = await fetch(`${serverUrl}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok') {
          updateServerStatusUI('connected');
          return;
        }
      }
      updateServerStatusUI('offline');
    } catch (err) {
      updateServerStatusUI('offline');
    }
  }

  function updateServerStatusUI(status) {
    if (status === 'connected') {
      serverStatusIndicator.style.background = '#10b981';
      serverStatusIndicator.style.boxShadow = '0 0 8px #10b981';
      serverStatusTitle.textContent = 'Stream Sunucusu Aktif';
      serverStatusSub.textContent = 'Telegram MTProto Canlı';
    } else if (status === 'demo') {
      serverStatusIndicator.style.background = '#38bdf8';
      serverStatusIndicator.style.boxShadow = '0 0 8px #38bdf8';
      serverStatusTitle.textContent = 'Demo Ses Modu';
      serverStatusSub.textContent = 'Çevrimdışı / Web Arşivi';
    } else {
      serverStatusIndicator.style.background = '#f59e0b';
      serverStatusIndicator.style.boxShadow = '0 0 8px #f59e0b';
      serverStatusTitle.textContent = 'Yerel Demo Fallback';
      serverStatusSub.textContent = 'Sunucu bekleniyor...';
    }
  }

  // ==========================================================================
  // KULLANICI ARAYÜZÜ VE BUTON ETKİLEŞİMLERİ (EVENT LISTENERS)
  // ==========================================================================
  function setupEventListeners() {
    // Play/Pause
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNextSong);
    prevBtn.addEventListener('click', playPrevSong);

    // Shuffle
    shuffleBtn.addEventListener('click', () => {
      state.isShuffle = !state.isShuffle;
      shuffleBtn.classList.toggle('active', state.isShuffle);
      showToast(state.isShuffle ? 'Karışık çalma açık' : 'Karışık çalma kapalı', 'info');
    });

    // Repeat (off -> all -> one)
    repeatBtn.addEventListener('click', () => {
      if (state.repeatMode === 'off') {
        state.repeatMode = 'all';
        repeatBtn.classList.add('active');
        repeatBtn.classList.remove('repeat-one');
        showToast('Tüm liste tekrarlanacak', 'info');
      } else if (state.repeatMode === 'all') {
        state.repeatMode = 'one';
        repeatBtn.classList.add('active', 'repeat-one');
        showToast('Şu anki şarkı tekrarlanacak', 'info');
      } else {
        state.repeatMode = 'off';
        repeatBtn.classList.remove('active', 'repeat-one');
        showToast('Tekrar kapatıldı', 'info');
      }
    });

    // Seek / İlerleme Çubuğu
    progressSeek.addEventListener('input', (e) => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        const percent = parseFloat(e.target.value);
        audio.currentTime = (percent / 100) * audio.duration;
      }
    });

    // Ses Seviyesi Slider
    volumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      state.volume = vol;
      audio.volume = vol;
      state.isMuted = vol === 0;
      updateVolumeIcons();
      localStorage.setItem('kirkyama_volume', vol.toString());
    });

    // Mute Butonu
    volumeBtn.addEventListener('click', () => {
      if (state.isMuted) {
        state.isMuted = false;
        audio.volume = state.volume > 0 ? state.volume : 0.85;
        volumeSlider.value = audio.volume;
      } else {
        state.isMuted = true;
        audio.volume = 0;
        volumeSlider.value = 0;
      }
      updateVolumeIcons();
    });

    // Oynatma Hızı Butonu
    playbackSpeedBtn.addEventListener('click', () => {
      const currentIdx = state.speedOptions.indexOf(state.playbackSpeed);
      const nextIdx = (currentIdx + 1) % state.speedOptions.length;
      state.playbackSpeed = state.speedOptions[nextIdx];
      audio.playbackRate = state.playbackSpeed;
      playbackSpeedBtn.textContent = `${state.playbackSpeed}x`;
      showToast(`Oynatma hızı: ${state.playbackSpeed}x`, 'info');
    });

    // Player Kalp (Favori) Butonu
    playerFavBtn.addEventListener('click', () => {
      if (state.currentSong) {
        toggleFavorite(state.currentSong.id);
      }
    });

    // Tümünü Çal Butonu
    playAllBtn.addEventListener('click', () => {
      const list = state.filteredSongs.length > 0 ? state.filteredSongs : state.allSongs;
      if (list.length > 0) {
        playSong(list[0], true);
        showToast('Liste baştan çalınıyor', 'info');
      }
    });

    // Arama Kutusu
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
      filterSongs();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      clearSearchBtn.style.display = 'none';
      filterSongs();
      searchInput.focus();
    });

    // Kategori Seçimi (Sidebar & Filter Chips)
    const allCategoryButtons = document.querySelectorAll('.category-item, .chip');
    allCategoryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        state.currentCategory = cat;

        // Active class sync
        document.querySelectorAll('.category-item').forEach(b => {
          b.classList.toggle('active', b.dataset.category === cat);
        });
        document.querySelectorAll('.chip').forEach(b => {
          b.classList.toggle('active', b.dataset.category === cat);
        });

        // Başlığı güncelle
        const sectionTitle = document.getElementById('sectionTitle');
        if (cat === 'all') sectionTitle.textContent = 'Tüm Şarkılar';
        else if (cat === 'lofi') sectionTitle.textContent = 'Lofi & Odaklanma Kuşağı';
        else if (cat === 'school') sectionTitle.textContent = 'Okul Teneffüs Kuşağı';
        else if (cat === 'soundtrack') sectionTitle.textContent = 'Kült Film Müzikleri';
        else if (cat === 'classical') sectionTitle.textContent = 'Klasik Başyapıtlar';
        else if (cat === 'turkce') sectionTitle.textContent = 'Türkçe Seçkiler';
        else if (cat === 'yabanci') sectionTitle.textContent = 'Yabancı Seçkiler';

        state.currentView = 'discover';
        filterSongs();

        // Mobildeyse sidebar'ı kapat
        sidebar.classList.remove('open');
      });
    });

    // Sidebar Navigasyonu (Keşfet, Favorilerim, Kuyruk)
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(nav => {
      nav.addEventListener('click', () => {
        const view = nav.dataset.view;
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(n => n.classList.remove('active'));
        nav.classList.add('active');

        if (view === 'discover') {
          state.currentView = 'discover';
          state.currentCategory = 'all';
          document.getElementById('sectionTitle').textContent = 'Tüm Şarkılar';
          filterSongs();
        } else if (view === 'favorites') {
          state.currentView = 'favorites';
          document.getElementById('sectionTitle').textContent = 'Favori Parçalarım';
          renderSongList();
        } else if (view === 'queue-mobile') {
          queueDrawer.classList.add('open');
        }

        sidebar.classList.remove('open');
      });
    });

    // Çekmece (Queue Drawer) Aç/Kapa
    toggleQueueBtn.addEventListener('click', () => {
      queueDrawer.classList.toggle('open');
    });
    closeQueueBtn.addEventListener('click', () => {
      queueDrawer.classList.remove('open');
    });
    clearQueueBtn.addEventListener('click', () => {
      state.queue = [];
      updateQueueUI();
      showToast('Kuyruk temizlendi.', 'info');
    });

    // Mobil Menü Aç/Kapa
    openSidebarBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
    });
    closeSidebarBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });

    // Sunucu Ayarları Modalı
    serverSettingsBtn.addEventListener('click', () => {
      serverUrlInput.value = state.streamServerUrl;
      const playModeRadio = serverSettingsModal.querySelector(`input[name="playMode"][value="${state.playMode}"]`);
      if (playModeRadio) playModeRadio.checked = true;
      serverTestResult.textContent = '';
      serverSettingsModal.style.display = 'flex';
    });

    closeSettingsModalBtn.addEventListener('click', () => {
      serverSettingsModal.style.display = 'none';
    });
    cancelSettingsBtn.addEventListener('click', () => {
      serverSettingsModal.style.display = 'none';
    });

    // Ayarları Kaydet
    saveSettingsBtn.addEventListener('click', () => {
      const newUrl = serverUrlInput.value.trim();
      const selectedMode = serverSettingsModal.querySelector('input[name="playMode"]:checked').value;

      state.streamServerUrl = newUrl;
      state.playMode = selectedMode;

      localStorage.setItem('kirkyama_server_url', newUrl);
      localStorage.setItem('kirkyama_play_mode', selectedMode);

      serverSettingsModal.style.display = 'none';
      showToast('Sunucu bağlantı ayarları kaydedildi!', 'success');
      checkServerHealthQuiet();
    });

    // Sunucu Bağlantısını Test Et Butonu
    testServerBtn.addEventListener('click', async () => {
      const url = serverUrlInput.value.trim().replace(/\/+$/, '');
      if (!url) {
        serverTestResult.className = 'test-result error';
        serverTestResult.textContent = 'Lütfen geçerli bir URL girin.';
        return;
      }
      serverTestResult.className = 'test-result';
      serverTestResult.textContent = 'Bağlantı test ediliyor...';

      try {
        const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const data = await res.json();
          serverTestResult.className = 'test-result success';
          serverTestResult.textContent = `✓ Başarılı! (Telegram: ${data.telegramConnected ? 'Bağlı' : 'Beklemede'})`;
        } else {
          serverTestResult.className = 'test-result error';
          serverTestResult.textContent = `Hata: HTTP ${res.status}`;
        }
      } catch (e) {
        serverTestResult.className = 'test-result error';
        serverTestResult.textContent = '✗ Sunucuya ulaşılamadı. (CORS veya kapalı)';
      }
    });

    // Klavye Kısayolları (Space: Play/Pause, ArrowRight: Next, ArrowLeft: Prev)
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight' && e.ctrlKey) {
        e.preventDefault();
        playNextSong();
      } else if (e.code === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        playPrevSong();
      }
    });
  }

  function updateVolumeIcons() {
    if (state.isMuted || audio.volume === 0) {
      volumeHighIcon.style.display = 'none';
      volumeMuteIcon.style.display = 'block';
    } else {
      volumeHighIcon.style.display = 'block';
      volumeMuteIcon.style.display = 'none';
    }
  }

  // ==========================================================================
  // YARDIMCI FONKSİYONLAR: ZAMAN VE TOAST BİLDİRİM
  // ==========================================================================
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Uygulamayı Başlat
  document.addEventListener('DOMContentLoaded', init);
})();
