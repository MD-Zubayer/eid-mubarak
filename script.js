        const nameInput = document.getElementById('nameInput');
        const greetingBox = document.getElementById('greetingBox');
        const personalGreeting = document.getElementById('personalGreeting');

        nameInput.addEventListener('input', function() {
            const name = this.value.trim();
            
            if(name.length > 0) {
                personalGreeting.textContent = `${name}, আপনার জন্য`;
                greetingBox.style.display = 'block';
            } else {
                greetingBox.style.display = 'none';
            }
        });



     nameInput.addEventListener('input', function() {
            if(this.value.trim().length > 0) {
                document.getElementById('eidAudio').play();
            }
        });