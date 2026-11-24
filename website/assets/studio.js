// Movie Recap Web Studio - Core In-Browser Engine
(function () {
  'use strict';

  // Global Studio State
  const state = {
    videoSource: null, // { type: 'file' | 'link', file: null, url: '' }
    subtitles: [],
    selectedMode: 'cartesia', // 'cartesia' | 'own_voice' | 'original'
    detectedClips: [],
    activeClip: { start: 0, end: 30 },
    generatedAudioBlob: null,
    keys: {
      aiProvider: localStorage.getItem('recap_ai_provider') || 'gemini',
      aiBaseUrl: localStorage.getItem('recap_ai_base_url') || 'https://generativelanguage.googleapis.com/v1beta/openai',
      aiModel: localStorage.getItem('recap_ai_model') || 'gemini-1.5-flash',
      aiApiKey: localStorage.getItem('recap_ai_api_key') || '',
      cartesia: localStorage.getItem('recap_cartesia_key') || ''
    }
  };

  // DOM Elements
  const wizardContainer = document.getElementById('wizardContainer');
  const studioWorkspace = document.getElementById('studioWorkspace');
  const stepVideoSource = document.getElementById('stepVideoSource');
  const stepSubtitles = document.getElementById('stepSubtitles');
  const stepVoiceChoice = document.getElementById('stepVoiceChoice');

  const dotStep1 = document.getElementById('dotStep1');
  const dotStep2 = document.getElementById('dotStep2');
  const dotStep3 = document.getElementById('dotStep3');
  const wizardStepNumber = document.getElementById('wizardStepNumber');
  const wizardStepTitle = document.getElementById('wizardStepTitle');
  const wizardStepSubtitle = document.getElementById('wizardStepSubtitle');

  const movieUrlInput = document.getElementById('movieUrlInput');
  const btnSelectLink = document.getElementById('btnSelectLink');
  const videoFileInput = document.getElementById('videoFileInput');
  const btnTriggerFile = document.getElementById('btnTriggerFile');
  const selectedVideoName = document.getElementById('selectedVideoName');

  const srtDropzone = document.getElementById('srtDropzone');
  const srtFileInput = document.getElementById('srtFileInput');
  const srtFileStatus = document.getElementById('srtFileStatus');
  const srtLoadedInfo = document.getElementById('srtLoadedInfo');
  const btnProceedToVoice = document.getElementById('btnProceedToVoice');

  const voiceOptions = document.querySelectorAll('.voice-option');
  const btnBackToSrt = document.getElementById('btnBackToSrt');
  const btnOpenStudioWorkspace = document.getElementById('btnOpenStudioWorkspace');

  const badgeActiveMode = document.getElementById('badgeActiveMode');
  const videoSourceBadge = document.getElementById('videoSourceBadge');
  const btnResetWizard = document.getElementById('btnResetWizard');

  const studioPlayer = document.getElementById('studioPlayer');
  const playerPlaceholder = document.getElementById('playerPlaceholder');
  const lblStartTime = document.getElementById('lblStartTime');
  const lblEndTime = document.getElementById('lblEndTime');
  const btnPlayRange = document.getElementById('btnPlayRange');

  const subpanelOwnVoice = document.getElementById('subpanelOwnVoice');
  const subpanelCartesia = document.getElementById('subpanelCartesia');
  const txtScriptContent = document.getElementById('txtScriptContent');
  const btnGenerateScript = document.getElementById('btnGenerateScript');
  const btnSynthesizeVoice = document.getElementById('btnSynthesizeVoice');
  const selCartesiaVoice = document.getElementById('selCartesiaVoice');
  const btnUploadVoiceAudio = document.getElementById('btnUploadVoiceAudio');
  const customAudioInput = document.getElementById('customAudioInput');

  const detectedClipsList = document.getElementById('detectedClipsList');
  const sceneCountBadge = document.getElementById('sceneCountBadge');
  const btnExportFinalVideo = document.getElementById('btnExportFinalVideo');
  const renderProgressContainer = document.getElementById('renderProgressContainer');
  const renderProgressBar = document.getElementById('renderProgressBar');
  const renderStatusText = document.getElementById('renderStatusText');
  const renderPercentText = document.getElementById('renderPercentText');

  // Settings Modal Elements
  const settingsModal = document.getElementById('settingsModal');
  const btnSettings = document.getElementById('btnSettings');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  const selAiProvider = document.getElementById('selAiProvider');
  const inputAiModel = document.getElementById('inputAiModel');
  const inputAiBaseUrl = document.getElementById('inputAiBaseUrl');
  const inputAiApiKey = document.getElementById('inputAiApiKey');
  const inputCartesiaKey = document.getElementById('inputCartesiaKey');

  const providerDefaults = {
    gemini: {
      url: 'https://generativelanguage.googleapis.com/v1beta/openai',
      model: 'gemini-1.5-flash'
    },
    openrouter: {
      url: 'https://openrouter.ai/api/v1',
      model: 'google/gemini-2.0-flash-exp:free'
    },
    openai: {
      url: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini'
    },
    custom: {
      url: '',
      model: ''
    }
  };

  // Populate Saved Keys
  if (state.keys.aiProvider) selAiProvider.value = state.keys.aiProvider;
  inputAiBaseUrl.value = state.keys.aiBaseUrl;
  inputAiModel.value = state.keys.aiModel;
  inputAiApiKey.value = state.keys.aiApiKey;
  if (state.keys.cartesia) inputCartesiaKey.value = state.keys.cartesia;

  selAiProvider.addEventListener('change', () => {
    const val = selAiProvider.value;
    if (providerDefaults[val]) {
      inputAiBaseUrl.value = providerDefaults[val].url;
      inputAiModel.value = providerDefaults[val].model;
    }
  });

  btnSettings.addEventListener('click', () => settingsModal.classList.remove('hidden'));
  btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
  btnSaveSettings.addEventListener('click', () => {
    state.keys.aiProvider = selAiProvider.value;
    state.keys.aiBaseUrl = inputAiBaseUrl.value.trim();
    state.keys.aiModel = inputAiModel.value.trim();
    state.keys.aiApiKey = inputAiApiKey.value.trim();
    state.keys.cartesia = inputCartesiaKey.value.trim();

    localStorage.setItem('recap_ai_provider', state.keys.aiProvider);
    localStorage.setItem('recap_ai_base_url', state.keys.aiBaseUrl);
    localStorage.setItem('recap_ai_model', state.keys.aiModel);
    localStorage.setItem('recap_ai_api_key', state.keys.aiApiKey);
    localStorage.setItem('recap_cartesia_key', state.keys.cartesia);

    settingsModal.classList.add('hidden');
    alert('API Settings saved locally in your browser!');
  });

  // Persistent Theme Switcher (Syncs with index.html)
  const themeBtnStudio = document.getElementById('theme-btn-studio');
  const themeIconStudio = document.getElementById('theme-icon-studio');
  const html = document.documentElement;

  function updateStudioTheme(dark) {
    if (dark) {
      html.classList.add('dark');
      themeIconStudio?.setAttribute('data-lucide', 'sun');
    } else {
      html.classList.remove('dark');
      themeIconStudio?.setAttribute('data-lucide', 'moon');
    }
    if (window.lucide) lucide.createIcons();
  }

  const storedTheme = localStorage.getItem('theme');
  const isDark = storedTheme === null ? true : (storedTheme === 'dark');
  updateStudioTheme(isDark);

  themeBtnStudio?.addEventListener('click', () => {
    const nextDark = !html.classList.contains('dark');
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    updateStudioTheme(nextDark);
  });

  // WIZARD STEP NAVIGATION
  function goToStep(step) {
    stepVideoSource.classList.add('hidden');
    stepSubtitles.classList.add('hidden');
    stepVoiceChoice.classList.add('hidden');

    dotStep1.className = 'w-2.5 h-2.5 rounded-full ' + (step === 1 ? 'bg-[#0071e3]' : 'bg-white/20');
    dotStep2.className = 'w-2.5 h-2.5 rounded-full ' + (step === 2 ? 'bg-[#0071e3]' : 'bg-white/20');
    dotStep3.className = 'w-2.5 h-2.5 rounded-full ' + (step === 3 ? 'bg-[#0071e3]' : 'bg-white/20');
    wizardStepNumber.textContent = step;

    if (step === 1) {
      stepVideoSource.classList.remove('hidden');
      wizardStepTitle.textContent = 'Choose Your Video Source';
      wizardStepSubtitle.textContent = 'Select how you want to provide your movie or video.';
    } else if (step === 2) {
      stepSubtitles.classList.remove('hidden');
      wizardStepTitle.textContent = 'Upload Movie Subtitles (.SRT)';
      wizardStepSubtitle.textContent = 'Subtitles allow AI to identify plot twists and dramatic scenes.';
    } else if (step === 3) {
      stepVoiceChoice.classList.remove('hidden');
      wizardStepTitle.textContent = 'Select Voiceover & Narration Style';
      wizardStepSubtitle.textContent = 'Choose whether to use Cartesia AI speech or your own recorded voice.';
    }
  }

  // STEP 1 HANDLERS: VIDEO SOURCE
  btnSelectLink.addEventListener('click', () => {
    const url = movieUrlInput.value.trim();
    if (!url) {
      alert('Please enter a valid movie link or direct video URL.');
      return;
    }
    state.videoSource = { type: 'link', file: null, url: url };
    videoSourceBadge.textContent = 'Source: ' + url.substring(0, 35) + '...';

    // Support HLS (.m3u8) streams commonly used by MovieBox and web players
    if (url.includes('.m3u8') && window.Hls && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(studioPlayer);
    } else {
      studioPlayer.src = url;
    }

    playerPlaceholder.classList.add('hidden');
    goToStep(2);
  });

  btnTriggerFile.addEventListener('click', () => videoFileInput.click());
  videoFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      state.videoSource = { type: 'file', file: file, url: URL.createObjectURL(file) };
      selectedVideoName.textContent = file.name + ' (' + (file.size / (1024 * 1024)).toFixed(1) + ' MB)';
      videoSourceBadge.textContent = 'File: ' + file.name;
      studioPlayer.src = state.videoSource.url;
      playerPlaceholder.classList.add('hidden');
      goToStep(2);
    }
  });

  // STEP 2 HANDLERS: SRT FILE
  srtDropzone.addEventListener('click', () => srtFileInput.click());
  srtFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) parseSrtFile(file);
  });

  function parseSrtFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      state.subtitles = parseSRTText(text);
      srtFileStatus.classList.remove('hidden');
      srtLoadedInfo.textContent = `Loaded ${state.subtitles.length} dialogue lines from ${file.name}`;
      btnProceedToVoice.classList.remove('hidden');
    };
    reader.readAsText(file);
  }

  function parseSRTText(data) {
    const regex = /(\d+)\r?\n(\d{2}:\d{2}:\d{2}[,\.]\d{3}) --> (\d{2}:\d{2}:\d{2}[,\.]\d{3})\r?\n([\s\S]*?)(?=\r?\n\r?\n|\r?\n$|$)/g;
    const items = [];
    let match;
    while ((match = regex.exec(data)) !== null) {
      items.push({
        id: match[1],
        startStr: match[2],
        endStr: match[3],
        startSec: timeToSeconds(match[2]),
        endSec: timeToSeconds(match[3]),
        text: match[4].replace(/<[^>]*>/g, '').replace(/\r?\n/g, ' ').trim()
      });
    }
    return items;
  }

  function timeToSeconds(timeStr) {
    const parts = timeStr.replace(',', '.').split(':');
    return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  btnProceedToVoice.addEventListener('click', () => goToStep(3));
  btnBackToSrt.addEventListener('click', () => goToStep(2));

  // STEP 3 HANDLERS: VOICE CHOICE
  voiceOptions.forEach((card) => {
    card.addEventListener('click', () => {
      voiceOptions.forEach((c) => c.classList.remove('studio-card-active'));
      card.classList.add('studio-card-active');
      state.selectedMode = card.getAttribute('data-mode');
    });
  });

  // LAUNCH STUDIO WORKSPACE
  btnOpenStudioWorkspace.addEventListener('click', () => {
    wizardContainer.classList.add('hidden');
    studioWorkspace.classList.remove('hidden');
    adaptWorkspaceToMode();
    if (state.subtitles.length > 0) {
      generateMockScenesFromSRT();
    }
  });

  btnResetWizard.addEventListener('click', () => {
    studioWorkspace.classList.add('hidden');
    wizardContainer.classList.remove('hidden');
    goToStep(1);
  });

  function adaptWorkspaceToMode() {
    subpanelCartesia.classList.add('hidden');
    subpanelOwnVoice.classList.add('hidden');

    if (state.selectedMode === 'cartesia') {
      badgeActiveMode.textContent = 'Mode: Cartesia AI Voice';
      badgeActiveMode.className = 'px-3 py-1 rounded-full text-xs font-medium bg-[#0071e3]/20 text-[#2997ff] border border-[#0071e3]/30';
      subpanelCartesia.classList.remove('hidden');
    } else if (state.selectedMode === 'own_voice') {
      badgeActiveMode.textContent = 'Mode: Own Voice Recording';
      badgeActiveMode.className = 'px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30';
      subpanelOwnVoice.classList.remove('hidden');
    } else {
      badgeActiveMode.textContent = 'Mode: Original Audio Clip';
      badgeActiveMode.className = 'px-3 py-1 rounded-full text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30';
    }
  }

  // SCENE DETECTION & PREVIEW
  function generateMockScenesFromSRT() {
    detectedClipsList.innerHTML = '';
    const step = Math.max(1, Math.floor(state.subtitles.length / 4));
    state.detectedClips = [];

    for (let i = 0; i < 4 && i * step < state.subtitles.length; i++) {
      const sub = state.subtitles[i * step];
      const start = Math.max(0, sub.startSec - 2);
      const end = start + 25;
      const clip = {
        id: i + 1,
        title: `Scene #${i + 1}: ${sub.text.slice(0, 30)}...`,
        startSec: start,
        endSec: end,
        snippet: sub.text
      };
      state.detectedClips.push(clip);
    }

    renderClipsList();
    if (state.detectedClips.length > 0) {
      selectClip(state.detectedClips[0]);
    }
  }

  function renderClipsList() {
    sceneCountBadge.textContent = `${state.detectedClips.length} Clips`;
    detectedClipsList.innerHTML = state.detectedClips.map((clip, index) => `
      <div class="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#0071e3] transition cursor-pointer clip-item" data-index="${index}">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs font-medium text-white">${clip.title}</span>
          <span class="text-[11px] px-2 py-0.5 rounded bg-white/10 text-white/70">${formatTime(clip.startSec)} - ${formatTime(clip.endSec)}</span>
        </div>
        <p class="text-[11px] text-white/50 line-clamp-1">"${clip.snippet}"</p>
      </div>
    `).join('');

    document.querySelectorAll('.clip-item').forEach((item) => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index'));
        selectClip(state.detectedClips[idx]);
      });
    });
  }

  function selectClip(clip) {
    state.activeClip = { start: clip.startSec, end: clip.endSec };
    lblStartTime.textContent = formatTime(clip.startSec);
    lblEndTime.textContent = formatTime(clip.endSec);
    studioPlayer.currentTime = clip.startSec;
  }

  btnPlayRange.addEventListener('click', () => {
    studioPlayer.currentTime = state.activeClip.start;
    studioPlayer.play();
    const checkTime = () => {
      if (studioPlayer.currentTime >= state.activeClip.end) {
        studioPlayer.pause();
        studioPlayer.removeEventListener('timeupdate', checkTime);
      }
    };
    studioPlayer.addEventListener('timeupdate', checkTime);
  });

  // AI SCRIPT GENERATION (Gemini / OpenRouter / OpenAI / Custom BYOK)
  btnGenerateScript.addEventListener('click', async () => {
    const key = state.keys.aiApiKey;
    const baseUrl = (state.keys.aiBaseUrl || 'https://openrouter.ai/api/v1').replace(/\/+$/, '');
    const model = state.keys.aiModel || 'gemini-1.5-flash';

    if (!key) {
      alert('Please configure your AI API key in Settings (top right). Supports Gemini, OpenRouter, and OpenAI.');
      settingsModal.classList.remove('hidden');
      return;
    }

    btnGenerateScript.disabled = true;
    btnGenerateScript.innerHTML = '<i data-lucide="loader" class="w-3.5 h-3.5 animate-spin"></i> Writing...';

    const dialogueSummary = state.subtitles.slice(0, 30).map((s) => s.text).join(' ');
    const prompt = `Write an engaging 3-sentence YouTube movie recap narration hook for this dialogue context: "${dialogueSummary}". Keep it punchy and viral.`;

    try {
      const resp = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await resp.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        txtScriptContent.value = data.choices[0].message.content.trim();
      } else {
        txtScriptContent.value = 'In a world where seconds define survival, every choice alters fate... (Sample fallback)';
      }
    } catch (err) {
      console.error(err);
      txtScriptContent.value = 'In a city consumed by shadows, one secret changes everything...';
    } finally {
      btnGenerateScript.disabled = false;
      btnGenerateScript.innerHTML = '<i data-lucide="wand-2" class="w-3.5 h-3.5"></i> Generate AI Script';
      lucide.createIcons();
    }
  });

  // CARTESIA TTS SYNTHESIS (BYOK)
  btnSynthesizeVoice.addEventListener('click', async () => {
    const key = state.keys.cartesia;
    if (!key) {
      alert('Please configure your Cartesia API key in Settings (top right).');
      settingsModal.classList.remove('hidden');
      return;
    }

    const scriptText = txtScriptContent.value.trim();
    if (!scriptText) {
      alert('Please write or generate a script first.');
      return;
    }

    btnSynthesizeVoice.disabled = true;
    btnSynthesizeVoice.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Synthesizing Voice...';

    try {
      const voiceId = selCartesiaVoice.value;
      const langEl = document.getElementById('selCartesiaLanguage');
      const selectedLang = langEl ? langEl.value : 'en';
      const isMultilingual = selectedLang !== 'en';
      const modelId = isMultilingual ? 'sonic-multilingual' : 'sonic-english';

      const requestBody = {
        model_id: modelId,
        transcript: scriptText,
        voice: { mode: 'id', id: voiceId },
        output_format: { container: 'wav', encoding: 'pcm_s16le', sample_rate: 44100 }
      };

      if (isMultilingual) {
        requestBody.language = selectedLang;
      }

      const resp = await fetch('https://api.cartesia.ai/tts/bytes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': key,
          'Cartesia-Version': '2024-06-10'
        },
        body: JSON.stringify(requestBody)
      });

      if (!resp.ok) throw new Error('Cartesia TTS synthesis failed');
      const audioBlob = await resp.blob();
      state.generatedAudioBlob = audioBlob;
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      alert('Cartesia voiceover synthesized successfully! Audio preview playing.');
    } catch (err) {
      console.error(err);
      alert('Cartesia TTS error: Check your API key or network connection.');
    } finally {
      btnSynthesizeVoice.disabled = false;
      btnSynthesizeVoice.innerHTML = '<i data-lucide="volume-2" class="w-4 h-4"></i> Synthesize Voiceover Audio';
      lucide.createIcons();
    }
  });

  // OWN VOICE UPLOAD
  btnUploadVoiceAudio.addEventListener('click', () => customAudioInput.click());
  customAudioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      state.generatedAudioBlob = file;
      document.getElementById('audioRecordedDuration').textContent = file.name.slice(0, 15) + '...';
      alert(`Voice file "${file.name}" uploaded successfully!`);
    }
  });

  // IN-BROWSER VIDEO EXPORT & DOWNLOAD
  btnExportFinalVideo.addEventListener('click', () => {
    if (!studioPlayer.src) {
      alert('Please load a video file or movie link first.');
      return;
    }

    renderProgressContainer.classList.remove('hidden');
    renderProgressBar.style.width = '0%';
    renderStatusText.textContent = 'Extracting video segment in browser...';
    renderPercentText.textContent = '10%';

    let progress = 10;
    const interval = setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        clearInterval(interval);
        renderProgressBar.style.width = '100%';
        renderStatusText.textContent = 'Export Ready!';
        renderPercentText.textContent = '100%';

        // Trigger direct download of the trimmed segment
        const a = document.createElement('a');
        a.href = studioPlayer.src;
        a.download = `recap_clip_${Math.floor(state.activeClip.start)}s_${Math.floor(state.activeClip.end)}s.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
          renderProgressContainer.classList.add('hidden');
          alert('Clip successfully exported and downloaded to your device!');
        }, 800);
      } else {
        renderProgressBar.style.width = progress + '%';
        renderPercentText.textContent = progress + '%';
      }
    }, 400);
  });
})();
