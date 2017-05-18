(function() {
    const clotheDisplay = document.querySelector('.dress-alternatives');

    const clothes = [
        'Dresse',
        'Shirt',
        'Pants',
        'Socks',
        'Shoes'
    ];
    var canvas = document.getElementById('canvas');
    console.log(canvas);
    var context = canvas.getContext('2d');
    var video = document.getElementById('video');
    let i = getRandomArbitrary(0, clothes.length);
    
    document.getElementById("snap").addEventListener("click", function() {
        context.drawImage(video, 0, 0, 640, 480);
    });

    function setFirstDress() {
        clotheDisplay.innerHTML = clothes[i];
    }

    setFirstDress();

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
   
    setInterval(() => {
        i = getRandomArbitrary(0, clothes.length);
        clotheDisplay.innerHTML = clothes[i];
    }, 2500);

    var video = document.getElementById('video');

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
}

})();