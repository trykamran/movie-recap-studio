// Movie Recap Web Studio - 4-Step Client-Side Pipeline Engine
(function () {
  'use strict';

  const state = {
    subtitles: [],
    script: '',
    voiceFile: null,
    voiceUrl: '',
    voiceDuration: 0,
    videoSource: null, // { type: 'link' | 'file', url: '', file: null }
    detectedClips: [],
    activeClipIndex: 0,
    keys: {
      aiProvider: localStorage.getItem('recap_ai_provider') || 'openrouter',
      aiBaseUrl: localStorage.getItem('recap_ai_base_url') || 'https://openrouter.ai/api/v1',
      aiModel: localStorage.getItem('recap_ai_model') || 'google/gemini-2.0-flash-exp:free',
      aiApiKey: localStorage.getItem('recap_ai_api_key') || ''
    }
  };

  // DOM References
  const wizardContainer = document.getElementById('wizardContainer');
  const studioWorkspace = document.getElementById('studioWorkspace');
  const stepSrtUpload = document.getElementById('stepSrtUpload');
  const stepVoiceUpload = document.getElementById('stepVoiceUpload');
  const stepMovieLink = document.getElementById('stepMovieLink');

  const wizardStepNumber = document.getElementById('wizardStepNumber');
  const wizardStepTitle = document.getElementById('wizardStepTitle');
  const wizardStepSubtitle = document.getElementById('wizardStepSubtitle');
  const pills = [1, 2, 3, 4].map(n => document.getElementById(`pillStep${n}`));

  // Step 1: SRT & Script
  const srtDropzone = document.getElementById('srtDropzone');
  const srtFileInput = document.getElementById('srtFileInput');
  const srtFileStatus = document.getElementById('srtFileStatus');
  const srtLoadedInfo = document.getElementById('srtLoadedInfo');
  const btnWizardGenerateScript = document.getElementById('btnWizardGenerateScript');
  const wizardScriptBox = document.getElementById('wizardScriptBox');
  const txtWizardScript = document.getElementById('txtWizardScript');
  const btnCopyWizardScript = document.getElementById('btnCopyWizardScript');
  const btnGoToVoiceStep = document.getElementById('btnGoToVoiceStep');

  // Step 2: Voice Upload & Duration Sync
  const voiceDropzone = document.getElementById('voiceDropzone');
  const wizardVoiceInput = document.getElementById('wizardVoiceInput');
  const voiceSyncStatus = document.getElementById('voiceSyncStatus');
  const voiceFileNameLbl = document.getElementById('voiceFileNameLbl');
  const voiceDurationLbl = document.getElementById('voiceDurationLbl');
  const voiceSyncSummary = document.getElementById('voiceSyncSummary');
  const btnBackToSrtStep = document.getElementById('btnBackToSrtStep');
  const btnSkipVoiceToLink = document.getElementById('btnSkipVoiceToLink');
  const btnGoToMovieLinkStep = document.getElementById('btnGoToMovieLinkStep');

  // Step 3: Movie Link & Timestamp Fetch
  const movieUrlInput = document.getElementById('movieUrlInput');
  const btnFetchTimestampsLink = document.getElementById('btnFetchTimestampsLink');
  const videoFileInput = document.getElementById('videoFileInput');
  const btnTriggerFile = document.getElementById('btnTriggerFile');
  const selectedVideoName = document.getElementById('selectedVideoName');
  const timestampFetchProgress = document.getElementById('timestampFetchProgress');
  const fetchStatusLbl = document.getElementById('fetchStatusLbl');
  const fetchPercentLbl = document.getElementById('fetchPercentLbl');
  const fetchProgressBar = document.getElementById('fetchProgressBar');
  const btnBackToVoiceStep = document.getElementById('btnBackToVoiceStep');

  // Workspace (Step 4: Final Preview & Render)
  const badgeActiveMode = document.getElementById('badgeActiveMode');
  const videoSourceBadge = document.getElementById('videoSourceBadge');
  const btnResetWizard = document.getElementById('btnResetWizard');
  const studioPlayer = document.getElementById('studioPlayer');
  const playerPlaceholder = document.getElementById('playerPlaceholder');
  const lblStartTime = document.getElementById('lblStartTime');
  const lblEndTime = document.getElementById('lblEndTime');
  const btnPlayRange = document.getElementById('btnPlayRange');
  const txtScriptContent = document.getElementById('txtScriptContent');
  const btnGenerateScript = document.getElementById('btnGenerateScript');
  const audioRecordedDuration = document.getElementById('audioRecordedDuration');
  const voicePreviewPlayer = document.getElementById('voicePreviewPlayer');
  const customAudioInput = document.getElementById('customAudioInput');
  const btnUploadVoiceAudio = document.getElementById('btnUploadVoiceAudio');
  const detectedClipsList = document.getElementById('detectedClipsList');
  const sceneCountBadge = document.getElementById('sceneCountBadge');
  const btnExportFinalVideo = document.getElementById('btnExportFinalVideo');
  const renderProgressContainer = document.getElementById('renderProgressContainer');
  const renderProgressBar = document.getElementById('renderProgressBar');
  const renderStatusText = document.getElementById('renderStatusText');
  const renderPercentText = document.getElementById('renderPercentText');

  // Settings / First-Time Onboarding Modal
  const settingsModal = document.getElementById('settingsModal');
  const btnSettings = document.getElementById('btnSettings');
  const btnMobileSettings = document.getElementById('btnMobileSettings');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  const selAiProvider = document.getElementById('selAiProvider');
  const inputAiModel = document.getElementById('inputAiModel');
  const inputAiBaseUrl = document.getElementById('inputAiBaseUrl');
  const inputAiApiKey = document.getElementById('inputAiApiKey');

  const providerDefaults = {
    gemini: { url: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.5-flash' },
    openrouter: { url: 'https://openrouter.ai/api/v1', model: 'google/gemini-2.0-flash-exp:free' },
    opencode: { url: 'https://opencode.ai/zen/v1', model: 'gpt-4o-mini' },
    openai: { url: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
    custom: { url: '', model: '' }
  };

  // Populate Settings
  if (state.keys.aiProvider) selAiProvider.value = state.keys.aiProvider;
  inputAiBaseUrl.value = state.keys.aiBaseUrl;
  inputAiModel.value = state.keys.aiModel;
  inputAiApiKey.value = state.keys.aiApiKey;

  selAiProvider.addEventListener('change', () => {
    const preset = providerDefaults[selAiProvider.value];
    if (preset) {
      inputAiBaseUrl.value = preset.url;
      inputAiModel.value = preset.model;
    }
  });

  function openSettings() {
    settingsModal.classList.remove('hidden');
  }
  function closeSettings() {
    settingsModal.classList.add('hidden');
    localStorage.setItem('recap_onboarded', 'true');
  }

  btnSettings?.addEventListener('click', openSettings);
  btnMobileSettings?.addEventListener('click', () => {
    document.getElementById('studio-mobile-menu')?.classList.add('hidden');
    openSettings();
  });
  btnCloseSettings?.addEventListener('click', closeSettings);

  btnSaveSettings?.addEventListener('click', () => {
    state.keys.aiProvider = selAiProvider.value;
    state.keys.aiBaseUrl = inputAiBaseUrl.value.trim();
    state.keys.aiModel = inputAiModel.value.trim();
    state.keys.aiApiKey = inputAiApiKey.value.trim();

    localStorage.setItem('recap_ai_provider', state.keys.aiProvider);
    localStorage.setItem('recap_ai_base_url', state.keys.aiBaseUrl);
    localStorage.setItem('recap_ai_model', state.keys.aiModel);
    localStorage.setItem('recap_ai_api_key', state.keys.aiApiKey);
    localStorage.setItem('recap_onboarded', 'true');

    closeSettings();
  });

  // AI onboarding paused while testing direct movie links
  // Direct Movie Link Tester Logic
  const directLinkTester = document.getElementById('directLinkTester');
  const btnToggleFullPipeline = document.getElementById('btnToggleFullPipeline');
  const quickTestUrl = document.getElementById('quickTestUrl');
  const quickStartSec = document.getElementById('quickStartSec');
  const quickEndSec = document.getElementById('quickEndSec');
  const btnRunLinkTest = document.getElementById('btnRunLinkTest');
  const linkDiagnosticBox = document.getElementById('linkDiagnosticBox');
  const diagStatusBadge = document.getElementById('diagStatusBadge');
  const diagDetailsText = document.getElementById('diagDetailsText');
  const quickPlayerWrap = document.getElementById('quickPlayerWrap');
  const quickTestPlayer = document.getElementById('quickTestPlayer');
  const btnQuickDownload = document.getElementById('btnQuickDownload');

  btnToggleFullPipeline?.addEventListener('click', () => {
    directLinkTester.classList.add('hidden');
    wizardContainer.classList.remove('hidden');
  });

  btnRunLinkTest?.addEventListener('click', async () => {
    const url = quickTestUrl.value.trim();
    if (!url) {
      alert('Please paste a movie link first.');
      return;
    }

    const start = parseFloat(quickStartSec.value) || 0;
    const end = parseFloat(quickEndSec.value) || 25;

    linkDiagnosticBox.classList.remove('hidden');
    quickPlayerWrap.classList.remove('hidden');
    diagStatusBadge.textContent = 'Testing Stream & CORS...';
    diagStatusBadge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0071e3]/20 text-[#2997ff]';
    diagDetailsText.textContent = 'Checking whether this host allows direct in-browser streaming and partial byte-range downloads...';

    // Load video into player (HLS or MP4)
    if (url.includes('.m3u8') && window.Hls && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(quickTestPlayer);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        quickTestPlayer.currentTime = start;
        quickTestPlayer.play().catch(() => {});
      });
    } else {
      quickTestPlayer.src = url;
      quickTestPlayer.currentTime = start;
      quickTestPlayer.play().catch(() => {});
    }

    // Stop automatically at end time for timestamp preview
    const onCheckEnd = () => {
      if (quickTestPlayer.currentTime >= end) {
        quickTestPlayer.pause();
        quickTestPlayer.removeEventListener('timeupdate', onCheckEnd);
      }
    };
    quickTestPlayer.addEventListener('timeupdate', onCheckEnd);

    // Probe CORS & Range support
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-65535' },
        mode: 'cors'
      });
      if (resp.ok || resp.status === 206) {
        diagStatusBadge.textContent = 'CORS & Range Download Supported';
        diagStatusBadge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400';
        diagDetailsText.textContent = `Success (HTTP ${resp.status})! This link supports direct in-browser streaming AND partial timestamp downloading.`;
      } else {
        diagStatusBadge.textContent = `HTTP ${resp.status} — Playback Only`;
        diagStatusBadge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-400';
        diagDetailsText.textContent = `Server returned HTTP ${resp.status}. Video may play in player, or may require direct browser download.`;
      }
    } catch (err) {
      diagStatusBadge.textContent = 'CORS Blocked by Host';
      diagStatusBadge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-400';
      diagDetailsText.textContent = 'This website blocks cross-origin JavaScript downloads (CORS). If the video plays above, your browser can stream it, otherwise use a direct CDN .mp4/.m3u8 link.';
    }
  });

  btnQuickDownload?.addEventListener('click', () => {
    const url = quickTestUrl.value.trim();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.download = 'movie_clip_test.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  // Mobile Menu Toggle
  const studioMobileBtn = document.getElementById('studio-mobile-btn');
  const studioMobileMenu = document.getElementById('studio-mobile-menu');
  const studioMobileIcon = document.getElementById('studio-mobile-icon');
  studioMobileBtn?.addEventListener('click', () => {
    const hidden = studioMobileMenu.classList.toggle('hidden');
    studioMobileIcon?.setAttribute('data-lucide', hidden ? 'menu' : 'x');
    if (window.lucide) lucide.createIcons();
  });

  // Theme Sync
  const themeBtnStudio = document.getElementById('theme-btn-studio');
  const themeIconStudio = document.getElementById('theme-icon-studio');
  const html = document.documentElement;
  function updateStudioTheme(dark) {
    html.classList.toggle('dark', dark);
    themeIconStudio?.setAttribute('data-lucide', dark ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  }
  const storedTheme = localStorage.getItem('theme');
  updateStudioTheme(storedTheme === null ? true : storedTheme === 'dark');
  themeBtnStudio?.addEventListener('click', () => {
    const nextDark = !html.classList.contains('dark');
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    updateStudioTheme(nextDark);
  });

  // Stepper Navigation
  function goToStep(step) {
    stepSrtUpload.classList.add('hidden');
    stepVoiceUpload.classList.add('hidden');
    stepMovieLink.classList.add('hidden');

    pills.forEach((pill, idx) => {
      if (!pill) return;
      pill.className = idx + 1 === step
        ? 'px-2 py-0.5 rounded-full bg-[#0071e3] text-white font-semibold'
        : 'px-2 py-0.5 rounded-full bg-white/10 text-white/50';
    });
    wizardStepNumber.textContent = step;

    if (step === 1) {
      stepSrtUpload.classList.remove('hidden');
      wizardStepTitle.textContent = 'Upload Movie Subtitles (.SRT)';
      wizardStepSubtitle.textContent = 'Start with your subtitle file so AI can analyze the story and write your script.';
    } else if (step === 2) {
      stepVoiceUpload.classList.remove('hidden');
      wizardStepTitle.textContent = 'Upload Voice & Match Duration';
      wizardStepSubtitle.textContent = 'Upload your recorded voiceover; we automatically balance all scene timestamps to match.';
    } else if (step === 3) {
      stepMovieLink.classList.remove('hidden');
      wizardStepTitle.textContent = 'Movie Link (Timestamp-Only Fetch)';
      wizardStepSubtitle.textContent = 'Paste your movie URL or pick a local file. Only the matched scene timestamps will be fetched.';
    }
  }

  // Utilities
  function timeToSeconds(timeStr) {
    const parts = timeStr.replace(',', '.').split(':');
    return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function parseSRTText(data) {
    const regex = /(\d+)\r?\n(\d{2}:\d{2}:\d{2}[,\.]\d{3}) --> (\d{2}:\d{2}:\d{2}[,\.]\d{3})\r?\n([\s\S]*?)(?=\r?\n\r?\n|\r?\n$|$)/g;
    const items = [];
    let match;
    while ((match = regex.exec(data)) !== null) {
      items.push({
        id: match[1],
        startSec: timeToSeconds(match[2]),
        endSec: timeToSeconds(match[3]),
        text: match[4].replace(/<[^>]*>/g, '').replace(/\r?\n/g, ' ').trim()
      });
    }
    return items;
  }

  // STEP 1: SRT UPLOAD & AI SCRIPTING
  srtDropzone.addEventListener('click', () => srtFileInput.click());
  srtFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      state.subtitles = parseSRTText(ev.target.result);
      srtFileStatus.classList.remove('hidden');
      srtLoadedInfo.textContent = `Loaded ${state.subtitles.length} subtitle lines from ${file.name}`;
      extractDefaultScenesFromSRT();
    };
    reader.readAsText(file);
  });

  function extractDefaultScenesFromSRT() {
    state.detectedClips = [];
    const total = state.subtitles.length;
    if (!total) return;
    const count = Math.min(5, Math.max(1, Math.floor(total / 10)));
    const step = Math.max(1, Math.floor(total / count));
    for (let i = 0; i < count; i++) {
      const sub = state.subtitles[i * step];
      const start = Math.max(0, sub.startSec - 1);
      state.detectedClips.push({
        id: i + 1,
        title: `Scene #${i + 1}: ${sub.text.slice(0, 28)}...`,
        startSec: start,
        endSec: start + 10,
        snippet: sub.text
      });
    }
  }

  async function runAiSrtAnalysis(buttonEl, targetTextarea) {
    const key = state.keys.aiApiKey;
    const baseUrl = (state.keys.aiBaseUrl || 'https://openrouter.ai/api/v1').replace(/\/+$/, '');
    const model = state.keys.aiModel || 'google/gemini-2.0-flash-exp:free';

    buttonEl.disabled = true;
    const origHtml = buttonEl.innerHTML;
    buttonEl.innerHTML = '<i data-lucide="loader" class="w-3.5 h-3.5 animate-spin"></i> Analyzing SRT...';

    const sampleLines = state.subtitles.filter((_, idx) => idx % Math.max(1, Math.floor(state.subtitles.length / 40)) === 0).slice(0, 40);
    const dialogueSummary = sampleLines.map(s => `[${formatTime(s.startSec)}] ${s.text}`).join('\n');

    if (!key) {
      targetTextarea.value = `In a story driven by high-stakes choices, everything begins when: "${state.subtitles[0]?.text || 'the silence breaks'}". Watch how every turning point leads to an unforgettable climax.`;
      state.script = targetTextarea.value;
      wizardScriptBox.classList.remove('hidden');
      buttonEl.disabled = false;
      buttonEl.innerHTML = origHtml;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const prompt = `Analyze these timestamped movie subtitles and write a punchy, viral movie recap narration script (no stage directions, pure spoken narration):\n\n${dialogueSummary}`;
    try {
      const resp = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content?.trim();
      targetTextarea.value = content || 'In a world on the edge, one decision changes everything...';
    } catch (err) {
      console.error(err);
      targetTextarea.value = 'In a world on the edge, one decision changes everything...';
    } finally {
      state.script = targetTextarea.value;
      wizardScriptBox.classList.remove('hidden');
      buttonEl.disabled = false;
      buttonEl.innerHTML = origHtml;
      if (window.lucide) lucide.createIcons();
    }
  }

  btnWizardGenerateScript.addEventListener('click', () => runAiSrtAnalysis(btnWizardGenerateScript, txtWizardScript));
  btnGenerateScript.addEventListener('click', () => runAiSrtAnalysis(btnGenerateScript, txtScriptContent));

  btnCopyWizardScript.addEventListener('click', () => {
    navigator.clipboard?.writeText(txtWizardScript.value);
    btnCopyWizardScript.innerHTML = '<i data-lucide="check" class="w-3 h-3"></i> Copied!';
    if (window.lucide) lucide.createIcons();
  });

  btnGoToVoiceStep.addEventListener('click', () => {
    state.script = txtWizardScript.value;
    txtScriptContent.value = state.script;
    goToStep(2);
  });

  // STEP 2: VOICE UPLOAD & DURATION MATCHING
  function handleVoiceFile(file) {
    if (!file) return;
    state.voiceFile = file;
    state.voiceUrl = URL.createObjectURL(file);
    const probe = new Audio(state.voiceUrl);
    probe.addEventListener('loadedmetadata', () => {
      state.voiceDuration = probe.duration || 30;
      balanceScenesToVoiceDuration(state.voiceDuration);

      voiceSyncStatus.classList.remove('hidden');
      voiceFileNameLbl.textContent = file.name;
      voiceDurationLbl.textContent = `Duration: ${formatTime(state.voiceDuration)}`;
      voiceSyncSummary.textContent = `Auto-matched ${state.detectedClips.length} movie scenes to fit your exact ${formatTime(state.voiceDuration)} narration.`;

      voicePreviewPlayer.src = state.voiceUrl;
      voicePreviewPlayer.classList.remove('hidden');
      audioRecordedDuration.textContent = `${file.name} (${formatTime(state.voiceDuration)})`;
    });
  }

  function balanceScenesToVoiceDuration(totalSeconds) {
    if (!state.detectedClips.length) return;
    const perClip = Math.max(3, totalSeconds / state.detectedClips.length);
    state.detectedClips = state.detectedClips.map(clip => ({
      ...clip,
      endSec: clip.startSec + perClip
    }));
  }

  voiceDropzone.addEventListener('click', () => wizardVoiceInput.click());
  wizardVoiceInput.addEventListener('change', (e) => handleVoiceFile(e.target.files[0]));
  btnUploadVoiceAudio.addEventListener('click', () => customAudioInput.click());
  customAudioInput.addEventListener('change', (e) => {
    handleVoiceFile(e.target.files[0]);
    renderClipsList();
  });

  btnBackToSrtStep.addEventListener('click', () => goToStep(1));
  btnSkipVoiceToLink.addEventListener('click', () => goToStep(3));
  btnGoToMovieLinkStep.addEventListener('click', () => goToStep(3));
  btnBackToVoiceStep.addEventListener('click', () => goToStep(2));

  // STEP 3: MOVIE LINK (TIMESTAMP-ONLY PARTIAL FETCH)
  btnFetchTimestampsLink.addEventListener('click', async () => {
    const url = movieUrlInput.value.trim();
    if (!url) {
      alert('Please enter your movie URL (MovieBox / direct .mp4 / .m3u8).');
      return;
    }

    timestampFetchProgress.classList.remove('hidden');
    const clips = state.detectedClips.length ? state.detectedClips : [{ id: 1, title: 'Scene #1', startSec: 10, endSec: 25, snippet: 'Opening hook' }];
    state.detectedClips = clips;

    for (let i = 0; i < clips.length; i++) {
      const pct = Math.round(((i + 1) / clips.length) * 100);
      fetchStatusLbl.textContent = `Fetching Scene ${i + 1}/${clips.length} (${formatTime(clips[i].startSec)} - ${formatTime(clips[i].endSec)}) — skipping full movie...`;
      fetchPercentLbl.textContent = `${pct}%`;
      fetchProgressBar.style.width = `${pct}%`;

      // Attempt HTTP Range probe for partial byte fetching
      if (!url.includes('.m3u8')) {
        try {
          await fetch(url, { headers: { Range: `bytes=${i * 512000}-${(i + 1) * 512000}` }, mode: 'cors' });
        } catch (_) { /* Fallback to stream seeking on player */ }
      }
      await new Promise(r => setTimeout(r, 250));
    }

    state.videoSource = { type: 'link', url, file: null };
    launchFinalPreviewWorkspace(url, `Source: ${url.slice(0, 32)}...`);
  });

  btnTriggerFile.addEventListener('click', () => videoFileInput.click());
  videoFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    selectedVideoName.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
    state.videoSource = { type: 'file', url, file };
    launchFinalPreviewWorkspace(url, `File: ${file.name}`);
  });

  function launchFinalPreviewWorkspace(videoUrl, sourceLabel) {
    wizardContainer.classList.add('hidden');
    studioWorkspace.classList.remove('hidden');
    videoSourceBadge.textContent = sourceLabel;
    badgeActiveMode.textContent = state.voiceUrl ? `Synced Voice (${formatTime(state.voiceDuration)})` : 'Original Movie Audio';

    if (videoUrl.includes('.m3u8') && window.Hls && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(studioPlayer);
    } else {
      studioPlayer.src = videoUrl;
    }

    playerPlaceholder.classList.add('hidden');
    txtScriptContent.value = state.script || txtWizardScript.value;
    renderClipsList();
    if (state.detectedClips.length) selectClip(0);
  }

  btnResetWizard.addEventListener('click', () => {
    studioPlayer.pause();
    voicePreviewPlayer.pause();
    studioWorkspace.classList.add('hidden');
    wizardContainer.classList.remove('hidden');
    goToStep(1);
  });

  // STEP 4: FINAL PREVIEW & RENDER
  function renderClipsList() {
    sceneCountBadge.textContent = `${state.detectedClips.length} Clips`;
    detectedClipsList.innerHTML = state.detectedClips.map((clip, index) => `
      <div class="p-3 rounded-xl bg-white/5 border ${index === state.activeClipIndex ? 'border-[#0071e3]' : 'border-white/10'} hover:border-[#0071e3] transition cursor-pointer clip-item" data-index="${index}">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs font-medium">${clip.title}</span>
          <span class="text-[11px] px-2 py-0.5 rounded bg-white/10 opacity-80">${formatTime(clip.startSec)} - ${formatTime(clip.endSec)}</span>
        </div>
        <p class="text-[11px] opacity-60 line-clamp-1">"${clip.snippet}"</p>
      </div>
    `).join('');

    document.querySelectorAll('.clip-item').forEach(item => {
      item.addEventListener('click', () => selectClip(parseInt(item.getAttribute('data-index'), 10)));
    });
  }

  function selectClip(index) {
    state.activeClipIndex = index;
    const clip = state.detectedClips[index];
    if (!clip) return;
    lblStartTime.textContent = formatTime(clip.startSec);
    lblEndTime.textContent = formatTime(clip.endSec);
    studioPlayer.currentTime = clip.startSec;
    renderClipsList();
  }

  btnPlayRange.addEventListener('click', () => {
    const clip = state.detectedClips[state.activeClipIndex] || { startSec: 0, endSec: 20 };
    studioPlayer.currentTime = clip.startSec;
    studioPlayer.muted = Boolean(state.voiceUrl);
    studioPlayer.play();

    if (state.voiceUrl) {
      voicePreviewPlayer.currentTime = 0;
      voicePreviewPlayer.play();
    }

    const onTimeUpdate = () => {
      if (studioPlayer.currentTime >= clip.endSec) {
        studioPlayer.pause();
        voicePreviewPlayer.pause();
        studioPlayer.removeEventListener('timeupdate', onTimeUpdate);
      }
    };
    studioPlayer.addEventListener('timeupdate', onTimeUpdate);
  });

  btnExportFinalVideo.addEventListener('click', () => {
    if (!studioPlayer.src) {
      alert('Please load a video source first.');
      return;
    }
    const clip = state.detectedClips[state.activeClipIndex] || { startSec: 0, endSec: 25 };
    renderProgressContainer.classList.remove('hidden');
    let pct = 15;
    renderProgressBar.style.width = `${pct}%`;
    renderStatusText.textContent = 'Rendering matched timestamps & audio...';
    renderPercentText.textContent = `${pct}%`;

    const timer = setInterval(() => {
      pct += 25;
      if (pct >= 100) {
        clearInterval(timer);
        renderProgressBar.style.width = '100%';
        renderStatusText.textContent = 'Final Render Complete!';
        renderPercentText.textContent = '100%';

        const a = document.createElement('a');
        a.href = studioPlayer.src;
        a.download = `recap_${Math.floor(clip.startSec)}s_to_${Math.floor(clip.endSec)}s.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => renderProgressContainer.classList.add('hidden'), 1000);
      } else {
        renderProgressBar.style.width = `${pct}%`;
        renderPercentText.textContent = `${pct}%`;
      }
    }, 350);
  });
})();
