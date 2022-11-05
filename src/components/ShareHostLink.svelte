<script lang="ts">

export let gameid: string;
export let code: string;

const url: string = `https://pawn-hub.de/play/${gameid}-${code}`;

function handleShareCopy() {
    navigator.clipboard.writeText(url);
}

function handleShareWhatsApp() {
    const message = `Come play chess against me at ${url}!`;
    const action = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(action, '_blank');
}

function handleShareTelegram() {
    const message = "Come play chess against me!";
    const action = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
    window.open(action, '_blank');
}

</script>

<div>
    <p class="text-base text-gray-500 font-medium text-center">Share This Game</p>
    <div class="flex gap-4 justify-center items-center">
        <button on:click={handleShareCopy}>Copy</button>
        <button on:click={handleShareWhatsApp}>WhatsApp</button>
        <button on:click={handleShareTelegram}>Telegram</button>
    </div>
</div>
