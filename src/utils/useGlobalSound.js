export function useGlobalSound() {
    return {
        play
    };

    function play(url) {
        const audio = new Audio(url);
        audio.volume = .5;
        audio.play();
    }
}