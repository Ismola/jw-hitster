interface ResultCardOptions {
    locale: string;
    title: string;
    resultLabel: string;
    score: number;
    scoreLabel: string;
    category: string;
    categoryLabel: string;
    date: Date;
}

export type ShareOutcome = 'shared' | 'downloaded' | 'cancelled';

const WIDTH = 1200;
const HEIGHT = 630;

function createResultCanvas(options: ResultCardOptions) {
    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is not supported');

    const gradient = context.createLinearGradient(0, 0, WIDTH, HEIGHT);
    gradient.addColorStop(0, '#11224e');
    gradient.addColorStop(0.55, '#293f78');
    gradient.addColorStop(1, '#6e5aa5');
    context.fillStyle = gradient;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.globalAlpha = 0.12;
    context.fillStyle = '#e9e5ff';
    context.beginPath();
    context.arc(1070, 80, 260, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(80, 650, 330, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;

    context.fillStyle = 'rgba(233, 229, 255, 0.1)';
    context.strokeStyle = 'rgba(233, 229, 255, 0.22)';
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(64, 56, WIDTH - 128, HEIGHT - 112, 36);
    context.fill();
    context.stroke();

    context.fillStyle = '#e9e5ff';
    context.font = '800 66px system-ui, sans-serif';
    context.fillText(options.title, 112, 150);

    context.fillStyle = 'rgba(233, 229, 255, 0.72)';
    context.font = '600 28px system-ui, sans-serif';
    context.fillText(options.resultLabel.toUpperCase(), 112, 218);

    context.fillStyle = '#ffffff';
    context.font = '900 170px system-ui, sans-serif';
    context.fillText(String(options.score), 104, 430);
    const scoreWidth = context.measureText(String(options.score)).width;
    context.fillStyle = '#e9e5ff';
    context.font = '700 38px system-ui, sans-serif';
    context.fillText(options.scoreLabel, 124 + scoreWidth, 414);

    const formattedDate = new Intl.DateTimeFormat(options.locale, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(options.date);

    context.fillStyle = 'rgba(233, 229, 255, 0.75)';
    context.font = '500 28px system-ui, sans-serif';
    context.fillText(`${options.categoryLabel}: ${options.category}`, 112, 514);
    context.textAlign = 'right';
    context.fillText(formattedDate, WIDTH - 112, 514);
    context.textAlign = 'left';

    context.fillStyle = '#e9e5ff';
    context.font = '700 25px system-ui, sans-serif';
    context.fillText('jw-hitster.ismola.dev', 112, 560);

    return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement) {
    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not generate result image')), 'image/png');
    });
}

export async function shareResultCard(options: ResultCardOptions): Promise<ShareOutcome> {
    const blob = await canvasToBlob(createResultCanvas(options));
    const dateStamp = options.date.toISOString().slice(0, 10);
    const filename = `jw-hitster-${dateStamp}.png`;
    const file = new File([blob], filename, { type: 'image/png' });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
            await navigator.share({ title: options.title, files: [file] });
            return 'shared';
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
        }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    return 'downloaded';
}
