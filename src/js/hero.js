import axios from "axios";

async function getArtists() {
    try {
        const res = await axios.get("https://sound-wave.b.goit.study/api/artists");
        return res.data.artists;
    } catch (error) {
        console.error("Помилка отримання артистів:", error);
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}

getArtists().then(artists => {
    const colLeft = document.getElementById("colLeft");
    const colRight = document.getElementById("colRight");

    if (!artists || artists.length === 0) return;

    const shuffled = shuffle([...artists]);

    const selected = shuffled.slice(0, 6);

    selected.slice(0, 3).forEach(artist => {
        const img = document.createElement("img");
        img.src = artist.strArtistThumb;
        img.className = "hero-img";
        colLeft.appendChild(img);
    });

    selected.slice(3, 6).forEach(artist => {
        const img = document.createElement("img");
        img.src = artist.strArtistThumb;
        img.className = "hero-img";
        colRight.appendChild(img);
    });
});
