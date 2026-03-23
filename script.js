let currentStep = 0;
const totalSteps = 4;
const pricePerCup = 5;

const dragonMessages = [
    "Hi there! I'm the Cornell Dragon Boat mascot. Ready for some delicious Chè Thái?",
    "Awesome! Let's get some basic info so we know who you are.",
    "Yum! How many cups of Chè Thái would you like? They are $5 each.",
    "Almost done! Just need your payment info and pickup confirmation.",
    "Roar-some! Your order is placed. Don't forget to send your payment!"
];

function updateDragonMessage() {
    const speechBubble = document.getElementById('dragon-speech');
    if (speechBubble) {
        speechBubble.style.opacity = '0';
        setTimeout(() => {
            speechBubble.innerText = dragonMessages[currentStep];
            speechBubble.style.opacity = '1';
        }, 300);
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        // Step 0 is 0%, Step 1 is 33%, Step 2 is 66%, Step 3 is 100%
        const percentage = currentStep < 4 ? (currentStep / 3) * 100 : 100;
        progressFill.style.width = `${percentage}%`;
    }
}

function showStep(stepIndex) {
    document.querySelectorAll('.form-step').forEach((step, index) => {
        if (index === stepIndex) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    updateDragonMessage();
    updateProgressBar();
}

function validateStep(stepIndex) {
    if (stepIndex === 1) {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const netId = document.getElementById('netId').value.trim();
        const gradYear = document.getElementById('gradYear').value;
        
        if (!fullName || !email || !netId || !gradYear) {
            alert('Please fill out all required personal info fields.');
            return false;
        }
        if (!email.includes('@')) {
            alert('Please enter a valid email address.');
            return false;
        }
    } else if (stepIndex === 2) {
        const quantity = parseInt(document.getElementById('quantity').value, 10);
        if (isNaN(quantity) || quantity < 1) {
            alert('Please order at least 1 cup of Chè Thái!');
            return false;
        }
    } else if (stepIndex === 3) {
        const paymentMethod = document.getElementById('paymentMethod').value.trim();
        const pickupAgreed = document.getElementById('pickupAgreed').checked;
        
        if (!paymentMethod) {
            alert('Please provide your Venmo ID or Phone Number.');
            return false;
        }
        if (!pickupAgreed) {
            alert('You must agree to the pickup terms to proceed.');
            return false;
        }
    }
    return true;
}

function nextStep() {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

function updateQuantity(change) {
    const qtyInput = document.getElementById('quantity');
    let currentQty = parseInt(qtyInput.value, 10);
    if (isNaN(currentQty)) currentQty = 0;
    
    let newQty = currentQty + change;
    if (newQty < 0) newQty = 0;
    
    qtyInput.value = newQty;
    
    // Update total cost
    const totalCost = newQty * pricePerCup;
    document.getElementById('total-cost').innerText = `$${totalCost}`;
}

async function submitForm() {
    if (!validateStep(3)) return;

    const submitBtn = document.getElementById('submit-btn');
    const errorMsg = document.getElementById('error-message');
    
    submitBtn.disabled = true;
    submitBtn.innerText = 'Submitting...';
    errorMsg.style.display = 'none';

    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const netId = document.getElementById('netId').value.trim();

    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        netId: netId,
        gradYear: document.getElementById('gradYear').value,
        quantity: quantity,
        totalCost: quantity * pricePerCup,
        paymentId: document.getElementById('paymentMethod').value.trim(),
        referrals: document.getElementById('referrals').value.trim()
    };

    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Failed to submit order');
        }

        // Update success screen with dynamic data
        document.getElementById('summary-qty').innerText = quantity;
        document.getElementById('summary-netid').innerText = netId;

        // Move to success step
        currentStep = 4;
        showStep(currentStep);

    } catch (error) {
        console.error('Submission error:', error);
        errorMsg.innerText = error.message || 'An error occurred while submitting your order. Please try again.';
        errorMsg.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submit Order';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showStep(0);
});
