# 🎵 Modern Music Player

A beautiful, feature-rich music player built with HTML, CSS, and JavaScript. This player supports multiple songs, playlist management, shuffle, repeat modes, volume control, and **local file uploads**.

🌐 **Live Demo:** [https://musickk.netlify.app/](https://musickk.netlify.app/)
---

## 📸 Preview

![image](https://github.com/user-attachments/assets/baab324a-f217-43a1-a2b1-6b2c33c1658d)

---

## ✨ Features

- **Multiple Songs Support**: Play through a playlist of songs
- **Local File Upload**: Add songs from your computer's storage
- **Persistent Storage**: Uploaded songs are saved and persist between browser sessions
- **Beautiful UI**: Modern glassmorphism design with gradients and animations
- **Playlist Management**: Click on any song in the playlist to play it
- **Shuffle Mode**: Randomize the playlist order
- **Repeat Modes**: 
  - No repeat
  - Repeat one song
  - Repeat all songs
- **Volume Control**: Adjust volume with a slider
- **Progress Bar**: Seek through songs by clicking on the progress bar
- **File Upload Notifications**: Visual feedback when adding songs
- **Clear Playlist**: Reset playlist to default songs
- **Keyboard Shortcuts**:
  - Spacebar: Play/Pause
  - Left Arrow: Previous song
  - Right Arrow: Next song
- **Responsive Design**: Works on desktop and mobile devices

## 🎮 Controls

- **Play/Pause Button**: Center button to play or pause music
- **Previous/Next**: Navigate between songs
- **Shuffle**: Randomize playlist order
- **Repeat**: Cycle through repeat modes (none → one → all)
- **Volume Slider**: Adjust playback volume
- **Progress Bar**: Click to seek to specific time
- **Playlist**: Click any song to play it directly
- **Add Songs Button**: Upload music files from your computer
- **Clear Playlist Button**: Reset playlist to default songs

## 📁 Adding Your Own Songs

### Method 1: File Upload (Recommended)
1. Click the **"Add Songs"** button
2. Select one or multiple audio files from your computer
3. Supported formats: MP3, WAV, OGG, M4A, and other audio formats
4. Songs will be automatically added to your playlist
5. You'll see a notification confirming the upload

### Method 2: Manual Code Editing
To add songs programmatically, edit the `songs` array in `script.js`:

```javascript
const songs = [
  {
    title: 'Your Song Title',
    artist: 'Artist Name',
    cover: 'path/to/cover-image.jpg',
    file: 'path/to/song.mp3',
    duration: '3:45'
  },
  // Add more songs...
];
```

### Song Properties:
- `title`: Song title
- `artist`: Artist name
- `cover`: URL or path to album cover image
- `file`: URL or path to the audio file
- `duration`: Song duration in MM:SS format

## 🚀 Getting Started

1. Open `index.html` in your web browser
2. The player will load with sample songs
3. Click the play button to start listening
4. Use the playlist to select different songs
5. Try the shuffle and repeat features
6. **Add your own music** using the "Add Songs" button

## 🎨 Customization

The player uses CSS custom properties and modern design techniques. You can customize:

- **Colors**: Modify the gradient backgrounds in `style.css`
- **Fonts**: Change the font family in the CSS
- **Animations**: Adjust transition timings
- **Layout**: Modify the container sizes and spacing

## 📱 Browser Support

This music player works in all modern browsers that support:
- HTML5 Audio API
- CSS Grid and Flexbox
- ES6 JavaScript features
- CSS backdrop-filter (for glassmorphism effect)
- File API (for local file uploads)

## 🎯 Sample Songs

The music player starts with an empty playlist. You can add your own songs using the **"Add Songs"** button to upload MP3 files from your computer.

**Supported Formats**: MP3, WAV, OGG, M4A, and other audio formats

## 🔧 Technical Details

- **HTML5 Audio**: Uses native browser audio capabilities
- **File API**: Handles local file uploads and creates object URLs
- **CSS Grid/Flexbox**: Modern layout techniques
- **JavaScript ES6**: Modern JavaScript features
- **Font Awesome**: Icons for the interface
- **Responsive Design**: Mobile-friendly layout
- **Notification System**: Visual feedback for user actions

## 💡 Tips

- **Multiple Files**: You can select multiple audio files at once when uploading
- **File Names**: The song title will be automatically extracted from the filename
- **Supported Formats**: Most common audio formats are supported (MP3, WAV, OGG, M4A, etc.)
- **Persistent Storage**: Uploaded songs are automatically saved and will persist between browser sessions
- **Storage Limits**: Browser localStorage has size limits (usually 5-10MB), so very large playlists may not save completely
- **Clear Playlist**: Use the "Clear Playlist" button to reset to default songs if needed
- **Cross-Device**: Songs are stored locally on each device/browser, not synced across devices

Enjoy your music! 🎶 
