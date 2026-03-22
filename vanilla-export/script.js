const CHE_THAI_PRICE = 5;

let currentStep = 0;
let formData = {
    fullName: '',
    email: '',
    netId: '',
    gradYear: '',
    quantity: 0,
    paymentMethod: '',
    referrals: '',
    pickupAgreed: false
};

const dragonMessages = [
    "Hi there! I'm the Cornell Dragon Boat mascot. Ready for some delicious Chè Thái?",
    "Awesome! Let's get some basic info so we know who you are.",
    "Yum! How many cups of Chè Thái would you like? They are $5 each.",
    "Almost done! Just need your payment info and pickup confirmation.",
    "Roar-some! Your order is placed. Don't forget to send your payment!"
];

function updateDragonMessage() {
    const bubble = document.getElementById('speech-bubble');
    bubble.style.opacity = 0;
    setTimeout(() => {
        bubble.innerText = dragonMessages[currentStep];
        bubble.style.opacity = 1;
    }, 300);
}

function showStep(stepIndex) {
    document.querySelectorAll('.step').forEach((el, index) => {
        if (index === stepIndex) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
    currentStep = stepIndex;
    updateDragonMessage();
}

function nextStep(targetStep) {
    showStep(targetStep);
}

function prevStep(targetStep) {
    showStep(targetStep);
}

function validateStep1() {
    formData.fullName = document.getElementById('fullName').value.trim();
    formData.email = document.getElementById('email').value.trim();
    formData.netId = document.getElementById('netId').value.trim();
    formData.gradYear = document.getElementById('gradYear').value;

    if (!formData.fullName || !formData.email || !formData.netId || !formData.gradYear) {
        alert('Please fill out all required personal info fields.');
        return;
    }
    nextStep(2);
}

function updateQuantity(change) {
    formData.quantity = Math.max(0, formData.quantity + change);
    document.getElementById('quantity-display').innerText = formData.quantity;
    document.getElementById('total-cost').innerText = '$' + (formData.quantity * CHE_THAI_PRICE);
}

function validateStep2() {
    if (formData.quantity < 1) {
        alert('Please order at least 1 cup of Chè Thái!');
        return;
    }
    nextStep(3);
}

async function submitForm() {
    formData.paymentMethod = document.getElementById('paymentMethod').value.trim();
    formData.referrals = document.getElementById('referrals').value.trim();
    formData.pickupAgreed = document.getElementById('pickupAgreed').checked;

    if (!formData.paymentMethod) {
        alert('Please provide your Venmo ID or Phone Number.');
        return;
    }
    if (!formData.pickupAgreed) {
        alert('You must agree to the pickup terms to proceed.');
        return;
    }

    const submitBtn = document.getElementById('submit-btn');
    const backBtn = document.getElementById('back-btn');
    const errorMsg = document.getElementById('error-message');
    
    submitBtn.innerText = 'Submitting...';
    submitBtn.disabled = true;
    backBtn.disabled = true;
    errorMsg.classList.add('hidden');

    try {
        const payload = {
            ...formData,
            totalCost: formData.quantity * CHE_THAI_PRICE
        };

        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Failed to submit order');
        }

        // Populate success screen data
        document.getElementById('final-qty').innerText = formData.quantity;
        document.getElementById('final-netid').innerText = formData.netId;
        
        nextStep(4);
    } catch (error) {
        console.error('Submission error:', error);
        errorMsg.innerText = error.message || 'An error occurred while submitting your order.';
        errorMsg.classList.remove('hidden');
    } finally {
        submitBtn.innerText = 'Submit Order';
        submitBtn.disabled = false;
        backBtn.disabled = false;
    }
}

// Initialize
updateDragonMessage();
