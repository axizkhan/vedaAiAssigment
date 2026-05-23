export class RenderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RenderError';
  }
}

export class BrowserLaunchError extends RenderError {
  constructor(message: string) {
    super(message);
    this.name = 'BrowserLaunchError';
  }
}

export class RenderTimeoutError extends RenderError {
  constructor(message: string) {
    super(message);
    this.name = 'RenderTimeoutError';
  }
}

export class PdfGenerationError extends RenderError {
  constructor(message: string) {
    super(message);
    this.name = 'PdfGenerationError';
  }
}

export class TemplateRenderError extends RenderError {
  constructor(message: string) {
    super(message);
    this.name = 'TemplateRenderError';
  }
}

export class ChromiumCrashError extends RenderError {
  constructor(message: string) {
    super(message);
    this.name = 'ChromiumCrashError';
  }
}
