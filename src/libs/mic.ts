export class Mic {
  private _mediaRecorder: MediaRecorder | null = null;
  private _chunks: Blob[] = [];

  constructor(
    private _onStart: () => void,
    private _onStop: (data: string, size?: number) => void
  ) {}

  get state() {
    return this._mediaRecorder?.state;
  }

  async start() {
    this._onStart();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this._mediaRecorder = new MediaRecorder(stream);
    this._mediaRecorder.start();

    this._chunks = [];

    this._mediaRecorder.ondataavailable = (e) => {
      this._chunks.push(e.data);
    };

    this._mediaRecorder.onstop = () => {
      const blob = new Blob(this._chunks, { type: "audio/ogg; codecs=opus" });
      this._chunks = [];
      const audioURL = URL.createObjectURL(blob);
      this._onStop(audioURL, blob.size);
    };
  }

  stop() {
    if (!this._mediaRecorder) return;
    this._mediaRecorder.stop();
    this._mediaRecorder = null;
  }

  reset() {
    this._mediaRecorder?.stop();
    this._mediaRecorder = null;
    this._chunks = [];
  }

  static isAvaiable() {
    return !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;
  }
}
