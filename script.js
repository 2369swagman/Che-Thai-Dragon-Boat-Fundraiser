document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('order-form');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const steps = document.querySelectorAll('.step-container');
    
    const dragonText = document.getElementById('dragon-text');
    const dragonEyes = document.getElementById('dragon-eyes');
    
    const qtyInput = document.getElementById('quantity');
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const displayTotal = document.getElementById('display-total');
    
    const summaryQty = document.getElementById('summary-qty');
    const summaryNetid = document.getElementById('summary-netid');
    const netIdInput = document.getElementById('netId');
    
    let currentStep = 0;
    const PRICE_PER_CUP = 5;

    // Dragon Dialogues per step
    const dialogues = [
        { text: "Hi! I'm here to help you order some delicious Chè Thái!", expression: "happy" },
        { text: "Tell me a bit about yourself so we know who's ordering!", expression: "thinking" },
        { text: "Ooh, the best part! How many cups would you like?", expression: "excited" },
        { text: "Almost done! Just review your total and payment instructions.", expression: "happy" },
        { text: "Yay! Thank you so much for supporting us!", expression: "excited" }
    ];

    const eyePaths = {
        happy: `
            <path d="M 38 30 Q 42 25 46 30" fill="none" stroke="#1c1917" stroke-width="2.5" stroke-linecap="round" />
            <path d="M 54 30 Q 58 25 62 30" fill="none" stroke="#1c1917" stroke-width="2.5" stroke-linecap="round" />
        `,
        thinking: `
            <circle cx="42" cy="28" r="3.5" fill="#1c1917" />
            <path d="M 54 30 Q 58 25 62 30" fill="none" stroke="#1c1917" stroke-width="2.5" stroke-linecap="round" />
        `,
        excited: `
            <circle cx="42" cy="28" r="3.5" fill="#1c1917" />
            <circle cx="58" cy="28" r="3.5" fill="#1c1917" />
            <circle cx="43" cy="27" r="1.5" fill="#FFF" />
            <circle cx="59" cy="27" r="1.5" fill="#FFF" />
            <ellipse cx="36" cy="34" rx="3" ry="2" fill="#ef4444" opacity="0.6" />
            <ellipse cx="64" cy="34" rx="3" ry="2" fill="#ef4444" opacity="0.6" />
        `
    };

    function updateDragon() {
        const d = dialogues[currentStep];
        dragonText.style.opacity = 0;
        setTimeout(() => {
            dragonText.textContent = d.text;
            dragonText.style.opacity = 1;
        }, 300);
        dragonEyes.innerHTML = eyePaths[d.expression];
    }

    function updateFormPosition() {
        form.style.transform = `translateX(-${currentStep * 100}%)`;
        updateDragon();
    }

    function validateStep() {
        const currentStepEl = steps[currentStep];
        const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim() || (input.type === 'checkbox' && !input.checked)) {
                isValid = false;
                input.classList.add('ring-2', 'ring-red-500');
                // Remove ring after animation
                setTimeout(() => input.classList.remove('ring-2', 'ring-red-500'), 2000);
            } else {
                input.classList.remove('ring-2', 'ring-red-500');
            }
        });

        if (currentStep === 2) {
            const qty = parseInt(qtyInput.value) || 0;
            if (qty <= 0) {
                isValid = false;
                dragonText.textContent = "Please select at least 1 cup!";
                dragonEyes.innerHTML = eyePaths.thinking;
                
                qtyInput.classList.add('ring-2', 'ring-red-500');
                setTimeout(() => qtyInput.classList.remove('ring-2', 'ring-red-500'), 2000);
            }
        }

        return isValid;
    }

    // Navigation
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep()) {
                if (currentStep === 2) {
                    // Update summary before moving to payment step
                    summaryQty.textContent = qtyInput.value;
                    summaryNetid.textContent = netIdInput.value || 'netID';
                }
                currentStep++;
                updateFormPosition();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            updateFormPosition();
        });
    });

    // Cart Logic
    function updateCart() {
        let qty = parseInt(qtyInput.value) || 0;
        if (qty < 0) qty = 0;
        qtyInput.value = qty;
        
        const total = qty * PRICE_PER_CUP;
        displayTotal.textContent = `$${total.toFixed(2)}`;
    }

    btnMinus.addEventListener('click', () => {
        let qty = parseInt(qtyInput.value) || 0;
        if (qty > 0) {
            qtyInput.value = qty - 1;
            updateCart();
        }
    });

    btnPlus.addEventListener('click', () => {
        let qty = parseInt(qtyInput.value) || 0;
        qtyInput.value = qty + 1;
        updateCart();
    });

    qtyInput.addEventListener('change', updateCart);

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        const submitBtn = document.getElementById('submit-btn');
        const spinner = document.getElementById('submit-spinner');
        
        submitBtn.disabled = true;
        spinner.classList.remove('hidden');

        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            netId: document.getElementById('netId').value,
            gradYear: document.getElementById('gradYear').value,
            quantity: parseInt(document.getElementById('quantity').value),
            totalCost: parseInt(document.getElementById('quantity').value) * PRICE_PER_CUP,
            paymentId: document.getElementById('paymentId').value,
            referrals: document.getElementById('referrals').value,
            pickupAgreement: document.getElementById('pickupAgreement').checked,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                currentStep++;
                updateFormPosition();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your order. Please try again.');
        } finally {
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
        }
    });

    // Initialize
    updateDragon();
});
