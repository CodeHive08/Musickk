// DOM Elements
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const progress = document.getElementById('progress');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume');
const playlist = document.getElementById('playlist');
const playOverlay = document.getElementById('playOverlay');
const addSongBtn = document.getElementById('addSongBtn');
const fileInput = document.getElementById('fileInput');
const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');

// Song list with sample data
// Note: Starting with an empty playlist. Use the "Add Songs" button to upload your own songs.
let songs = [];

// Player state
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let repeatMode = 'none'; // none, one, all
let originalPlaylist = [...songs];

// Load songs from localStorage on startup
function loadSongsFromStorage() {
  const savedSongs = localStorage.getItem('musicPlayerSongs');
  if (savedSongs) {
    try {
      const parsedSongs = JSON.parse(savedSongs);
      songs = parsedSongs;
      originalPlaylist = [...songs];
      showNotification('Loaded saved playlist', 'info');
    } catch (error) {
      console.error('Error loading saved songs:', error);
    }
  }
}

// Save songs to localStorage
function saveSongsToStorage() {
  try {
    localStorage.setItem('musicPlayerSongs', JSON.stringify(songs));
  } catch (error) {
    console.error('Error saving songs:', error);
    showNotification('Storage limit reached. Some songs may not be saved.', 'error');
  }
}

// Initialize player
function initPlayer() {
  loadSongsFromStorage();
  
  if (songs.length === 0) {
    title.textContent = 'No songs in playlist';
    artist.textContent = 'Add songs using the "Add Songs" button';
    cover.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center';
  } else {
    loadSong(currentSongIndex);
  }
  
  renderPlaylist();
  updatePlayButton();
  setVolume(70);
  
  // Show helpful message for first-time users or empty playlist
  if (!localStorage.getItem('musicPlayerFirstVisit') || songs.length === 0) {
    setTimeout(() => {
      showNotification('🎵 Welcome! Use "Add Songs" button to upload your music files!', 'info');
      localStorage.setItem('musicPlayerFirstVisit', 'true');
    }, 2000);
  }
}

// Load song
function loadSong(index) {
  if (songs.length === 0) {
    title.textContent = 'No songs in playlist';
    artist.textContent = 'Add songs using the "Add Songs" button';
    cover.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center';
    audio.src = '';
    return;
  }
  
  const song = songs[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  audio.src = song.file;
  
  // Update playlist active state
  updatePlaylistActiveState();
}

// Play song
function playSong() {
  if (songs.length === 0) {
    showNotification('No songs in playlist. Add songs first!', 'error');
    return;
  }
  isPlaying = true;
  audio.play();
  updatePlayButton();
}

// Pause song
function pauseSong() {
  isPlaying = false;
  audio.pause();
  updatePlayButton();
}

// Update play button
function updatePlayButton() {
  const icon = playBtn.querySelector('i');
  if (isPlaying) {
    icon.className = 'fas fa-pause';
  } else {
    icon.className = 'fas fa-play';
  }
}

// Next song
function nextSong() {
  if (songs.length === 0) {
    showNotification('No songs in playlist. Add songs first!', 'error');
    return;
  }
  
  if (isShuffled) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  }
  loadSong(currentSongIndex);
  if (isPlaying) playSong();
}

// Previous song
function prevSong() {
  if (songs.length === 0) {
    showNotification('No songs in playlist. Add songs first!', 'error');
    return;
  }
  
  if (isShuffled) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  }
  loadSong(currentSongIndex);
  if (isPlaying) playSong();
}

// Toggle shuffle
function toggleShuffle() {
  isShuffled = !isShuffled;
  shuffleBtn.classList.toggle('active', isShuffled);
  
  if (isShuffled) {
    // Create shuffled playlist
    songs.splice(0, songs.length, ...originalPlaylist.sort(() => Math.random() - 0.5));
  } else {
    // Restore original order
    songs.splice(0, songs.length, ...originalPlaylist);
    currentSongIndex = originalPlaylist.findIndex(song => song.title === songs[currentSongIndex].title);
  }
  renderPlaylist();
}

// Toggle repeat
function toggleRepeat() {
  const modes = ['none', 'one', 'all'];
  const currentIndex = modes.indexOf(repeatMode);
  repeatMode = modes[(currentIndex + 1) % modes.length];
  
  repeatBtn.classList.remove('active', 'repeat-one');
  if (repeatMode === 'one') {
    repeatBtn.classList.add('active', 'repeat-one');
  } else if (repeatMode === 'all') {
    repeatBtn.classList.add('active');
  }
}

// Set volume
function setVolume(value) {
  audio.volume = value / 100;
  volumeSlider.value = value;
}

// Format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Get duration from audio file
function getAudioDuration(file) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.addEventListener('loadedmetadata', () => {
      resolve(formatTime(audio.duration));
    });
    audio.src = URL.createObjectURL(file);
  });
}

// Add songs from file input
async function addSongsFromFiles(files) {
  for (let file of files) {
    if (file.type.startsWith('audio/')) {
      try {
        const duration = await getAudioDuration(file);
        const songUrl = URL.createObjectURL(file);
        
        // Extract filename without extension
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        
        const newSong = {
          title: fileName,
          artist: 'Local File',
          cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center',
          file: songUrl,
          duration: duration
        };
        
        songs.push(newSong);
        originalPlaylist.push(newSong);
        
        // Show success message
        showNotification(`Added: ${fileName}`, 'success');
      } catch (error) {
        console.error('Error adding song:', error);
        showNotification(`Error adding: ${file.name}`, 'error');
      }
    }
  }
  
  // Save to localStorage and update playlist display
  saveSongsToStorage();
  renderPlaylist();
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4ecdc4' : type === 'error' ? '#ff6b6b' : '#6c5ce7'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    font-size: 14px;
    font-weight: 500;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Render playlist
function renderPlaylist() {
  playlist.innerHTML = '';
  songs.forEach((song, index) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.classList.toggle('active', index === currentSongIndex);
    
    item.innerHTML = `
      <img src="${song.cover}" alt="${song.title}">
      <div class="playlist-item-info">
        <div class="playlist-item-title">${song.title}</div>
        <div class="playlist-item-artist">${song.artist}</div>
      </div>
      <div class="playlist-item-duration">${song.duration}</div>
    `;
    
    item.addEventListener('click', () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);
      if (isPlaying) playSong();
    });
    
    playlist.appendChild(item);
  });
}

// Update playlist active state
function updatePlaylistActiveState() {
  const items = playlist.querySelectorAll('.playlist-item');
  items.forEach((item, index) => {
    item.classList.toggle('active', index === currentSongIndex);
  });
}

// Clear playlist
function clearPlaylist() {
  if (confirm('Are you sure you want to clear the entire playlist? This action cannot be undone.')) {
    // Reset to empty playlist
    songs = [];
    originalPlaylist = [];
    currentSongIndex = 0;
    
    // Save to localStorage and update display
    saveSongsToStorage();
    loadSong(currentSongIndex);
    renderPlaylist();
    
    showNotification('Playlist cleared. Add new songs using the "Add Songs" button.', 'info');
  }
}

// Event Listeners

// Add song button
addSongBtn.addEventListener('click', () => {
  fileInput.click();
});

// File input change
fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    addSongsFromFiles(e.target.files);
    // Reset file input
    e.target.value = '';
  }
});

// Play/Pause button
playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Play overlay
playOverlay.addEventListener('click', () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Previous button
prevBtn.addEventListener('click', prevSong);

// Next button
nextBtn.addEventListener('click', nextSong);

// Shuffle button
shuffleBtn.addEventListener('click', toggleShuffle);

// Repeat button
repeatBtn.addEventListener('click', toggleRepeat);

// Volume control
volumeSlider.addEventListener('input', (e) => {
  setVolume(e.target.value);
});

// Progress bar
progress.addEventListener('input', (e) => {
  const time = (e.target.value / 100) * audio.duration;
  audio.currentTime = time;
});

// Audio events
audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.value = percent || 0;
  progressFill.style.width = `${percent}%`;
  
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  if (repeatMode === 'one') {
    audio.currentTime = 0;
    audio.play();
  } else if (repeatMode === 'all') {
    nextSong();
  } else {
    isPlaying = false;
    updatePlayButton();
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  switch(e.code) {
    case 'Space':
      e.preventDefault();
      if (isPlaying) pauseSong();
      else playSong();
      break;
    case 'ArrowLeft':
      prevSong();
      break;
    case 'ArrowRight':
      nextSong();
      break;
  }
});

// Clear playlist button
clearPlaylistBtn.addEventListener('click', clearPlaylist);

// Initialize the player
initPlayer(); 