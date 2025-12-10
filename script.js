// Menunggu DOM selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Homepage enter button
    document.getElementById('enter-site').addEventListener('click', function() {
        document.getElementById('homepage').classList.add('hidden');
        document.querySelector('header').classList.remove('hidden');
        document.querySelector('nav').classList.remove('hidden');
        document.getElementById('content').classList.remove('hidden');
        document.querySelector('footer').classList.remove('hidden');
        document.getElementById('fab').classList.remove('hidden');
    });
    // Fungsi untuk toggle detail dengan animasi smooth
    const readMoreButtons = document.querySelectorAll('.read-more');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const details = this.nextElementSibling;
            if (details.classList.contains('hidden')) {
                details.classList.remove('hidden');
                this.textContent = 'Tutup';
                details.style.maxHeight = details.scrollHeight + 'px';
            } else {
                details.style.maxHeight = '0';
                setTimeout(() => {
                    details.classList.add('hidden');
                    this.textContent = 'Baca Selengkapnya';
                }, 300);
            }
        });

        // Modal untuk double-click
        button.addEventListener('dblclick', function() {
            const legend = this.closest('.legend');
            const title = legend.querySelector('h2').textContent;
            const summary = legend.querySelector('p').textContent;
            const details = legend.querySelector('.details').textContent;

            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-summary').textContent = summary;
            document.getElementById('modal-details').textContent = details;

            const modal = document.getElementById('modal');
            modal.classList.add('show');
        });
    });

    // Fungsi untuk menutup modal
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('modal').classList.remove('show');
    });

    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Fungsi untuk filter dengan active state
    const filterButtons = document.querySelectorAll('nav button[id^="filter-"]');
    const legends = document.querySelectorAll('.legend');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterType = this.id.replace('filter-', '');

            // Check if quiz or merchandise is shown, and hide them to return to main content
            const quizSection = document.getElementById('quiz-section');
            const merchSection = document.getElementById('merchandise-section');
            const content = document.getElementById('content');
            if (!quizSection.classList.contains('hidden')) {
                quizSection.classList.add('hidden');
                content.classList.remove('hidden');
                document.getElementById('show-quiz').textContent = '🧠 Kuis';
            }
            if (!merchSection.classList.contains('hidden')) {
                merchSection.classList.add('hidden');
                content.classList.remove('hidden');
                document.getElementById('show-merchandise').textContent = '🛍️ Merchandise';
            }

            legends.forEach(legend => {
            const legendName = legend.querySelector('.favorite-btn').dataset.legend;
                const isFavorite = localStorage.getItem(`favorite-${legendName}`) === 'true';

                if (filterType === 'all' || legend.dataset.type === filterType || (filterType === 'favorites' && isFavorite)) {
                    legend.style.display = 'block';
                    setTimeout(() => legend.classList.add('fade-in'), 10);
                } else {
                    legend.classList.remove('fade-in');
                    setTimeout(() => legend.style.display = 'none', 300);
                }
            });
        });
    });

    // Fungsi untuk pencarian dengan debounce
    const searchInput = document.getElementById('search');
    let debounceTimer;
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const searchTerm = this.value.toLowerCase();
            legends.forEach(legend => {
                const title = legend.querySelector('h2').textContent.toLowerCase();
                const summary = legend.querySelector('p').textContent.toLowerCase();
                if (title.includes(searchTerm) || summary.includes(searchTerm)) {
                    legend.style.display = 'block';
                    setTimeout(() => legend.classList.add('fade-in'), 10);
                } else {
                    legend.classList.remove('fade-in');
                    setTimeout(() => legend.style.display = 'none', 300);
                }
            });
        }, 300);
    });

    // Fungsi untuk random legend
    document.getElementById('random-legend').addEventListener('click', function() {
        const visibleLegends = Array.from(legends).filter(legend => legend.style.display !== 'none');
        if (visibleLegends.length > 0) {
            const randomIndex = Math.floor(Math.random() * visibleLegends.length);
            const randomLegend = visibleLegends[randomIndex];
            randomLegend.scrollIntoView({ behavior: 'smooth', block: 'center' });
            randomLegend.style.boxShadow = '0 0 20px rgba(139, 0, 0, 0.8)';
            setTimeout(() => randomLegend.style.boxShadow = '', 2000);
        }
    });

    // Fungsi untuk dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.textContent = document.body.classList.contains('dark-mode') ? '☀️ Mode Terang' : '🌙 Mode Gelap';
    });

    // Fungsi untuk music toggle
    const musicToggle = document.getElementById('music-toggle');
    let audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'); // Placeholder music
    audio.loop = true;
    let isPlaying = false;
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            audio.pause();
            this.textContent = '🎵 Musik';
        } else {
            audio.play();
            this.textContent = '🔇 Stop Musik';
        }
        isPlaying = !isPlaying;
    });

    // Fungsi untuk haunted mode
    const hauntedModeToggle = document.getElementById('haunted-mode');
    let hauntedInterval;
    let hauntedAudio = new Audio('https://www.soundjay.com/misc/sounds/horror-ambience-01.wav'); // Placeholder haunted sound
    hauntedAudio.loop = true;
    hauntedAudio.volume = 0.3;

    hauntedModeToggle.addEventListener('click', function() {
        if (hauntedInterval) {
            clearInterval(hauntedInterval);
            hauntedInterval = null;
            document.body.classList.remove('haunted');
            this.textContent = '👻 Mode Angker';
            hauntedAudio.pause();
            hauntedAudio.currentTime = 0;
            // Reset all effects
            document.querySelectorAll('.legend').forEach(legend => {
                legend.style.opacity = '1';
            });
            document.body.style.boxShadow = '';
        } else {
            document.body.classList.add('haunted');
            this.textContent = '😱 Stop Angker';
            hauntedAudio.play().catch(e => console.log('Audio play failed:', e));
            hauntedInterval = setInterval(() => {
                // Random flickering effect
                const legends = document.querySelectorAll('.legend');
                legends.forEach(legend => {
                    if (Math.random() > 0.8) {
                        legend.style.opacity = Math.random() * 0.5 + 0.5;
                        setTimeout(() => legend.style.opacity = '1', 100);
                    }
                });
                // Random shadow movement
                if (Math.random() > 0.9) {
                    document.body.style.boxShadow = `inset 0 0 ${Math.random() * 50 + 10}px rgba(139, 0, 0, 0.3)`;
                    setTimeout(() => document.body.style.boxShadow = '', 200);
                }
                // Create particles
                if (Math.random() > 0.7) {
                    createParticle();
                }
                // Random scream sound (rare)
                if (Math.random() > 0.95) {
                    const scream = new Audio('https://www.soundjay.com/misc/sounds/woman-scream-01.wav');
                    scream.volume = 0.2;
                    scream.play().catch(e => console.log('Scream play failed:', e));
                }
            }, 2000);
        }
    });

    // Fungsi untuk hover effect pada gambar
    legends.forEach(legend => {
        const img = legend.querySelector('img');
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.filter = 'brightness(1.1)';
        });
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'brightness(1)';
        });
    });

    // Animasi fade-in untuk legend saat load
    legends.forEach((legend, index) => {
        setTimeout(() => legend.classList.add('fade-in'), index * 100);
    });

    // Typing effect untuk header
    const typingText = document.getElementById('typing-text');
    const originalText = typingText.textContent;
    typingText.textContent = '';
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            typingText.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    typeWriter();

    // Scroll progress bar
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    // Particle effect for haunted mode
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = Math.random() * 3 + 2 + 's';
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 5000);
    };

    // Enhanced haunted mode with particles
    hauntedModeToggle.addEventListener('click', function() {
        if (hauntedInterval) {
            clearInterval(hauntedInterval);
            hauntedInterval = null;
            document.body.classList.remove('haunted');
            this.textContent = '👻 Mode Angker';
        } else {
            document.body.classList.add('haunted');
            this.textContent = '😱 Stop Angker';
            hauntedInterval = setInterval(() => {
                // Random flickering effect
                const legends = document.querySelectorAll('.legend');
                legends.forEach(legend => {
                    if (Math.random() > 0.8) {
                        legend.style.opacity = Math.random() * 0.5 + 0.5;
                        setTimeout(() => legend.style.opacity = '1', 100);
                    }
                });
                // Random shadow movement
                if (Math.random() > 0.9) {
                    document.body.style.boxShadow = `inset 0 0 ${Math.random() * 50 + 10}px rgba(139, 0, 0, 0.3)`;
                    setTimeout(() => document.body.style.boxShadow = '', 200);
                }
                // Create particles
                if (Math.random() > 0.7) {
                    createParticle();
                }
            }, 2000);
        }
    });

    // Like/Dislike functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    const dislikeButtons = document.querySelectorAll('.dislike-btn');

    likeButtons.forEach(button => {
        const legend = button.dataset.legend;
        const countSpan = button.querySelector('.like-count');
        let count = parseInt(localStorage.getItem(`like-${legend}`)) || 0;
        countSpan.textContent = count;

        button.addEventListener('click', function() {
            count++;
            countSpan.textContent = count;
            localStorage.setItem(`like-${legend}`, count);
            this.style.transform = 'scale(1.2)';
            setTimeout(() => this.style.transform = 'scale(1)', 200);
        });
    });

    dislikeButtons.forEach(button => {
        const legend = button.dataset.legend;
        const countSpan = button.querySelector('.dislike-count');
        let count = parseInt(localStorage.getItem(`dislike-${legend}`)) || 0;
        countSpan.textContent = count;

        button.addEventListener('click', function() {
            count++;
            countSpan.textContent = count;
            localStorage.setItem(`dislike-${legend}`, count);
            this.style.transform = 'scale(1.2)';
            setTimeout(() => this.style.transform = 'scale(1)', 200);
        });
    });

    // Favorite functionality
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        const legend = button.dataset.legend;
        let isFavorite = localStorage.getItem(`favorite-${legend}`) === 'true';
        if (isFavorite) {
            button.textContent = '❤️';
        }

        button.addEventListener('click', function() {
            isFavorite = !isFavorite;
            if (isFavorite) {
                this.textContent = '❤️';
                localStorage.setItem(`favorite-${legend}`, 'true');
            } else {
                this.textContent = '🤍';
                localStorage.removeItem(`favorite-${legend}`);
            }
        });
    });

    // Share functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.dataset.platform;
            const legend = this.dataset.legend;
            const url = window.location.href;
            const title = `Legenda ${legend.charAt(0).toUpperCase() + legend.slice(1)}`;
            const text = `Baca tentang legenda ${legend} di situs ini!`;

            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: text,
                    url: url,
                });
            } else {
                let shareUrl = '';
                switch (platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                        break;
                }
                window.open(shareUrl, '_blank');
            }
        });
    });

    // Floating Action Button functionality
    const fabToggle = document.getElementById('fab-toggle');
    const fabMenu = document.getElementById('fab-menu');
    fabToggle.addEventListener('click', function() {
        fabMenu.classList.toggle('hidden');
        this.style.transform = fabMenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(45deg)';
    });

    // FAB menu buttons
    document.getElementById('fab-random').addEventListener('click', function() {
        document.getElementById('random-legend').click();
        fabMenu.classList.add('hidden');
        fabToggle.style.transform = 'rotate(0deg)';
    });

    document.getElementById('fab-dark').addEventListener('click', function() {
        document.getElementById('dark-mode-toggle').click();
        fabMenu.classList.add('hidden');
        fabToggle.style.transform = 'rotate(0deg)';
    });

    document.getElementById('fab-music').addEventListener('click', function() {
        document.getElementById('music-toggle').click();
        fabMenu.classList.add('hidden');
        fabToggle.style.transform = 'rotate(0deg)';
    });

    document.getElementById('fab-haunted').addEventListener('click', function() {
        document.getElementById('haunted-mode').click();
        fabMenu.classList.add('hidden');
        fabToggle.style.transform = 'rotate(0deg)';
    });

    // Show quiz button
    document.getElementById('show-quiz').addEventListener('click', function() {
        const quizSection = document.getElementById('quiz-section');
        const content = document.getElementById('content');
        if (quizSection.classList.contains('hidden')) {
            quizSection.classList.remove('hidden');
            content.classList.add('hidden');
            this.textContent = '🏠 Kembali';
            startQuiz();
        } else {
            quizSection.classList.add('hidden');
            content.classList.remove('hidden');
            this.textContent = '🧠 Kuis';
        }
    });

    // Quiz functionality
    const quizData = [
        {
            question: "Apa yang dimaksud dengan Kuntilanak?",
            answers: [
                { text: "Roh wanita jahat dengan rambut panjang", correct: true },
                { text: "Makhluk kecil seperti anak-anak", correct: false },
                { text: "Roh tentara Jepang", correct: false },
                { text: "Ratu laut selatan", correct: false }
            ]
        },
        {
            question: "Apa fungsi utama Tuyul menurut mitos?",
            answers: [
                { text: "Mencuri uang untuk majikannya", correct: true },
                { text: "Menjaga hutan", correct: false },
                { text: "Mengganggu wanita hamil", correct: false },
                { text: "Melompat-lompat mencari jalan", correct: false }
            ]
        },
        {
            question: "Apa yang dilakukan Pocong setelah dikubur?",
            answers: [
                { text: "Melompat-lompat mencari jalan", correct: true },
                { text: "Terbang di malam hari", correct: false },
                { text: "Mengubah bentuk menjadi pria tampan", correct: false },
                { text: "Menjerit seperti bayi", correct: false }
            ]
        },
        {
            question: "Siapa Nyi Roro Kidul?",
            answers: [
                { text: "Ratu laut selatan Jawa", correct: true },
                { text: "Roh wanita jahat", correct: false },
                { text: "Makhluk besar berbulu", correct: false },
                { text: "Hantu perawat", correct: false }
            ]
        },
        {
            question: "Apa ciri khas Genderuwo?",
            answers: [
                { text: "Makhluk besar berbulu yang hidup di hutan", correct: true },
                { text: "Anak kecil telanjang", correct: false },
                { text: "Wanita cantik berbaju hijau", correct: false },
                { text: "Tentara dengan seragam compang-camping", correct: false }
            ]
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let totalQuestions = quizData.length;

    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const scoreContainer = document.getElementById('score-container');
    const scoreElement = document.getElementById('score');
    const totalQuestionsElement = document.getElementById('total-questions');
    const resultMessage = document.getElementById('result-message');

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        nextBtn.classList.add('hidden');
        restartBtn.classList.add('hidden');
        scoreContainer.classList.add('hidden');
        showQuestion();
    }

    function showQuestion() {
        const currentQuestion = quizData[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        answersElement.innerHTML = '';

        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.classList.add('answer-btn');
            button.addEventListener('click', () => selectAnswer(answer.correct));
            answersElement.appendChild(button);
        });
    }

    function selectAnswer(isCorrect) {
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(button => {
            button.disabled = true;
            if (button.textContent === quizData[currentQuestionIndex].answers.find(a => a.correct).text) {
                button.classList.add('correct');
            } else {
                button.classList.add('incorrect');
            }
        });

        if (isCorrect) {
            score++;
        }

        nextBtn.classList.remove('hidden');
    }

    function showNextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < totalQuestions) {
            showQuestion();
            nextBtn.classList.add('hidden');
        } else {
            showScore();
        }
    }

    function showScore() {
        questionElement.textContent = '';
        answersElement.innerHTML = '';
        nextBtn.classList.add('hidden');
        scoreContainer.classList.remove('hidden');
        scoreElement.textContent = score;
        totalQuestionsElement.textContent = totalQuestions;

        let message = '';
        if (score === totalQuestions) {
            message = 'Luar biasa! Kamu tahu semua tentang mitos dan legenda Indonesia!';
        } else if (score >= totalQuestions * 0.7) {
            message = 'Bagus! Pengetahuanmu tentang mitos dan legenda cukup baik.';
        } else if (score >= totalQuestions * 0.5) {
            message = 'Cukup baik. Coba pelajari lebih banyak lagi!';
        } else {
            message = 'Belajar lagi yuk! Ada banyak cerita menarik di Indonesia.';
        }
        resultMessage.textContent = message;
        restartBtn.classList.remove('hidden');
    }

    nextBtn.addEventListener('click', showNextQuestion);
    restartBtn.addEventListener('click', startQuiz);

    // Show merchandise button
    document.getElementById('show-merchandise').addEventListener('click', function() {
        const merchandiseSection = document.getElementById('merchandise-section');
        const content = document.getElementById('content');
        if (merchandiseSection.classList.contains('hidden')) {
            merchandiseSection.classList.remove('hidden');
            content.classList.add('hidden');
            this.textContent = '🏠 Kembali';
        } else {
            merchandiseSection.classList.add('hidden');
            content.classList.remove('hidden');
            this.textContent = '🛍️ Merchandise';
        }
    });

    // Back to homepage button
    document.getElementById('back-to-homepage').addEventListener('click', function() {
        document.getElementById('homepage').classList.remove('hidden');
        document.querySelector('header').classList.add('hidden');
        document.querySelector('nav').classList.add('hidden');
        document.getElementById('content').classList.add('hidden');
        document.querySelector('footer').classList.add('hidden');
        document.getElementById('fab').classList.add('hidden');
        // Hide quiz and merchandise sections if they are open
        document.getElementById('quiz-section').classList.add('hidden');
        document.getElementById('merchandise-section').classList.add('hidden');
        // Reset button texts
        document.getElementById('show-quiz').textContent = '🧠 Kuis';
        document.getElementById('show-merchandise').textContent = '🛍️ Merchandise';
    });

    // Purchase Modal functionality
    const purchaseModal = document.getElementById('purchase-modal');
    const purchaseClose = document.querySelector('.purchase-close');
    const buyButtons = document.querySelectorAll('.buy-btn');
    const decreaseQtyBtn = document.getElementById('decrease-qty');
    const increaseQtyBtn = document.getElementById('increase-qty');
    const quantityInput = document.getElementById('quantity');
    const totalPriceElement = document.getElementById('total-price');
    const confirmPurchaseBtn = document.getElementById('confirm-purchase');
    const cancelPurchaseBtn = document.getElementById('cancel-purchase');

    let currentItemPrice = 0;

    // Function to open purchase modal
    function openPurchaseModal(itemElement) {
        const image = itemElement.querySelector('img').src;
        const name = itemElement.querySelector('h3').textContent;
        const description = itemElement.querySelector('p').textContent;
        const priceText = itemElement.querySelector('.price').textContent;
        const price = parseInt(priceText.replace(/[^\d]/g, ''));

        document.getElementById('purchase-image').src = image;
        document.getElementById('purchase-item-name').textContent = name;
        document.getElementById('purchase-item-description').textContent = description;
        document.getElementById('purchase-price').textContent = priceText;

        currentItemPrice = price;
        quantityInput.value = 1;
        updateTotalPrice();

        purchaseModal.classList.add('show');
    }

    // Function to update total price
    function updateTotalPrice() {
        const quantity = parseInt(quantityInput.value);
        const total = currentItemPrice * quantity;
        totalPriceElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }

    // Event listeners for buy buttons
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemElement = this.closest('.merchandise-item');
            openPurchaseModal(itemElement);
        });
    });

    // Quantity controls
    decreaseQtyBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantity--;
            quantityInput.value = quantity;
            updateTotalPrice();
        }
    });

    increaseQtyBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity < 10) {
            quantity++;
            quantityInput.value = quantity;
            updateTotalPrice();
        }
    });

    quantityInput.addEventListener('input', function() {
        let quantity = parseInt(this.value);
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
        } else if (quantity > 10) {
            quantity = 10;
        }
        this.value = quantity;
        updateTotalPrice();
    });

    // Confirm purchase
    confirmPurchaseBtn.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        const itemName = document.getElementById('purchase-item-name').textContent;
        const totalPrice = totalPriceElement.textContent;

        if (!selectedPayment) {
            alert('Silakan pilih metode pembayaran!');
            return;
        }

        // Here you would typically send the purchase data to a server
        // For now, we'll just show a success message
        alert(`Pembelian berhasil!\n\nItem: ${itemName}\nJumlah: ${quantity}\nTotal: ${totalPrice}\nMetode Pembayaran: ${selectedPayment.value}\n\nTerima kasih telah berbelanja!`);

        // Close modal
        purchaseModal.classList.remove('show');
    });

    // Cancel purchase
    cancelPurchaseBtn.addEventListener('click', function() {
        purchaseModal.classList.remove('show');
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === purchaseModal) {
            purchaseModal.classList.remove('show');
        }
    });

    // Close modal with close button
    purchaseClose.addEventListener('click', function() {
        purchaseModal.classList.remove('show');
    });




});
