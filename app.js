// TampakakiArt Gallery Application
class ArtGallery {
    constructor() {
        this.paintings = [
            {
                id: 1,
                title: "Sunset Over Aegean",
                artist: "TampakakiArt",
                price: 450,
                currency: "EUR",
                description: "A vibrant oil painting capturing the golden sunset over the Aegean Sea",
                dimensions: "60x40 cm",
                medium: "Oil on Canvas",
                year: 2024,
                status: "available"
            },
            {
                id: 2,
                title: "Abstract Emotions",
                artist: "TampakakiArt", 
                price: 320,
                currency: "EUR",
                description: "Contemporary abstract piece exploring human emotions through color and form",
                dimensions: "50x70 cm",
                medium: "Acrylic on Canvas",
                year: 2024,
                status: "available"
            },
            {
                id: 3,
                title: "Mediterranean Dreams",
                artist: "TampakakiArt",
                price: 680,
                currency: "EUR", 
                description: "Serene landscape depicting the beauty of Mediterranean coastal life",
                dimensions: "80x60 cm",
                medium: "Oil on Canvas",
                year: 2023,
                status: "available"
            },
            {
                id: 4,
                title: "Urban Rhythms",
                artist: "TampakakiArt",
                price: 280,
                currency: "EUR",
                description: "Dynamic cityscape capturing the energy and movement of modern urban life",
                dimensions: "40x60 cm", 
                medium: "Mixed Media",
                year: 2024,
                status: "available"
            },
            {
                id: 5,
                title: "Whispers of Nature",
                artist: "TampakakiArt",
                price: 520,
                currency: "EUR",
                description: "Delicate portrayal of forest scenes with intricate detail and natural harmony",
                dimensions: "70x50 cm",
                medium: "Watercolor on Paper", 
                year: 2024,
                status: "available"
            },
            {
                id: 6,
                title: "Cosmic Journey", 
                artist: "TampakakiArt",
                price: 750,
                currency: "EUR",
                description: "Ethereal space-inspired artwork with deep blues and celestial elements",
                dimensions: "90x60 cm",
                medium: "Oil on Canvas",
                year: 2023,
                status: "available"
            }
        ];

        this.supabase = null;
        this.currentOffer = null;
        this.paypalLoaded = false;
    }

    async init() {
        console.log('Initializing ArtGallery...');
        this.initSupabase();
        this.renderPaintings();
        this.bindEvents();
        this.initScrollAnimations();
        this.waitForPayPal();
    }

    initSupabase() {
        // Initialize Supabase client
        try {
            if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
                this.supabase = window.supabase.createClient(
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4YWRtb3BnbGNianZ3ZXdxdHlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg4MjgyNSwiZXhwIjoyMDcyNDU4ODI1fQ.R1uWe5-Ru1eIn-IP3GduPHwbH1f_cwbrIRcbMmXVwGY',
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4YWRtb3BnbGNianZ3ZXdxdHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4ODI4MjUsImV4cCI6MjA3MjQ1ODgyNX0.E5Yc5m6bOE2B7OHpoMHc4Z67tmdVatKGhD0yzu-3RUI'
                );
                console.log('Supabase initialized');
            }
        } catch (error) {
            console.warn('Supabase not available:', error);
        }
    }

    waitForPayPal() {
        // Check if PayPal is loaded every 500ms for up to 10 seconds
        let attempts = 0;
        const maxAttempts = 20;
        
        const checkPayPal = () => {
            attempts++;
            if (window.paypal && window.paypal.Buttons) {
                console.log('PayPal SDK loaded successfully');
                this.paypalLoaded = true;
                this.initAllPayPalButtons();
            } else if (attempts < maxAttempts) {
                setTimeout(checkPayPal, 500);
            } else {
                console.warn('PayPal SDK failed to load');
                this.handlePayPalFailure();
            }
        };
        
        checkPayPal();
    }

    handlePayPalFailure() {
        document.querySelectorAll('.paypal-button-container').forEach(container => {
            container.innerHTML = '<div class="btn btn--primary btn-buy-now">PayPal Unavailable</div>';
        });
    }

    renderPaintings() {
        const gallery = document.getElementById('galleryGrid');
        if (!gallery) {
            console.error('Gallery grid not found');
            return;
        }

        gallery.innerHTML = '';

        this.paintings.forEach((painting, index) => {
            const card = this.createPaintingCard(painting);
            gallery.appendChild(card);
            
            // Add staggered animation
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });

        console.log(`Rendered ${this.paintings.length} paintings`);
    }

    createPaintingCard(painting) {
        const card = document.createElement('div');
        card.className = 'painting-card';
        card.setAttribute('data-painting-id', painting.id);

        card.innerHTML = `
            <div class="painting-image">
                <div class="painting-placeholder">
                    ${painting.title}
                </div>
            </div>
            <div class="painting-info">
                <h3 class="painting-title">${painting.title}</h3>
                <div class="painting-details">
                    ${painting.medium} • ${painting.dimensions} • ${painting.year}
                </div>
                <p class="painting-description">${painting.description}</p>
                <div class="painting-price">€${painting.price}</div>
                <div class="painting-actions">
                    <button class="btn btn--outline btn-make-offer" data-painting-id="${painting.id}">
                        Make Offer
                    </button>
                    <div class="paypal-button-container" id="paypal-${painting.id}">
                        <div class="paypal-loading">Loading PayPal...</div>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    initAllPayPalButtons() {
        this.paintings.forEach(painting => {
            this.initPayPalButton(painting);
        });
    }

    initPayPalButton(painting) {
        if (!this.paypalLoaded || !window.paypal) {
            console.warn('PayPal not available for painting', painting.id);
            return;
        }

        const containerId = `paypal-${painting.id}`;
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.warn('PayPal container not found:', containerId);
            return;
        }

        // Clear loading text
        container.innerHTML = '';

        try {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: painting.price.toString(),
                                currency_code: 'EUR'
                            },
                            description: `${painting.title} by ${painting.artist}`,
                            custom_id: painting.id.toString()
                        }]
                    });
                },
                onApprove: async (data, actions) => {
                    try {
                        const order = await actions.order.capture();
                        console.log('Payment successful:', order);
                        
                        await this.logPurchase(painting, order);
                        this.showMessage('Payment successful! Thank you for your purchase.', 'success');
                    } catch (error) {
                        console.error('Payment capture error:', error);
                        this.showMessage('Payment processing failed. Please try again.', 'error');
                    }
                },
                onError: (err) => {
                    console.error('PayPal error:', err);
                    this.showMessage('Payment error occurred. Please try again.', 'error');
                },
                style: {
                    layout: 'horizontal',
                    color: 'blue',
                    shape: 'rect',
                    label: 'pay',
                    height: 40
                }
            }).render(`#${containerId}`);
        } catch (error) {
            console.error('Error initializing PayPal button:', error);
            container.innerHTML = '<div class="btn btn--primary">PayPal Error</div>';
        }
    }

    async logPurchase(painting, order) {
        const purchaseData = {
            painting_id: painting.id,
            painting_title: painting.title,
            amount: painting.price,
            currency: 'EUR',
            payment_method: 'paypal',
            transaction_id: order.id,
            status: 'completed',
            created_at: new Date().toISOString()
        };

        // Store in local storage as fallback
        try {
            const purchases = JSON.parse(localStorage.getItem('art_purchases') || '[]');
            purchases.push(purchaseData);
            localStorage.setItem('art_purchases', JSON.stringify(purchases));
            console.log('Purchase logged locally:', purchaseData);
        } catch (error) {
            console.error('Error storing purchase locally:', error);
        }

        // Try to store in Supabase if available
        if (this.supabase) {
            try {
                const { error } = await this.supabase
                    .from('art_purchases')
                    .insert([purchaseData]);
                
                if (error) {
                    console.warn('Supabase purchase insert error:', error);
                } else {
                    console.log('Purchase logged to Supabase');
                }
            } catch (error) {
                console.warn('Supabase not available for purchase logging:', error);
            }
        }
    }

    bindEvents() {
        console.log('Binding events...');

        // Make Offer button clicks using event delegation
        document.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('btn-make-offer')) {
                e.preventDefault();
                e.stopPropagation();
                const paintingId = parseInt(e.target.getAttribute('data-painting-id'));
                console.log('Make offer clicked for painting:', paintingId);
                this.openOfferModal(paintingId);
                return false;
            }
        });

        // Modal close events
        const modal = document.getElementById('offerModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelOffer');
        const backdrop = modal?.querySelector('.modal-backdrop');

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Close button clicked');
                this.closeOfferModal();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Cancel button clicked');
                this.closeOfferModal();
            });
        }

        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Backdrop clicked');
                this.closeOfferModal();
            });
        }

        // Form submission
        const form = document.getElementById('offerForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submitted');
                this.handleOfferSubmission(e);
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                console.log('Navigation clicked:', targetId);
                
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    // If target doesn't exist, scroll to gallery
                    const gallery = document.getElementById('gallery');
                    if (gallery) {
                        gallery.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeOfferModal();
            }
        });

        console.log('Events bound successfully');
    }

    openOfferModal(paintingId) {
        console.log('Opening offer modal for painting:', paintingId);
        const painting = this.paintings.find(p => p.id === paintingId);
        if (!painting) {
            console.error('Painting not found:', paintingId);
            return;
        }

        this.currentOffer = { paintingId, painting };

        // Populate form
        const paintingIdInput = document.getElementById('paintingId');
        const paintingTitleInput = document.getElementById('paintingTitle');
        const offerAmountInput = document.getElementById('offerAmount');

        if (paintingIdInput) paintingIdInput.value = painting.id;
        if (paintingTitleInput) paintingTitleInput.value = painting.title;
        if (offerAmountInput) {
            offerAmountInput.setAttribute('max', painting.price - 1);
            offerAmountInput.setAttribute('placeholder', `Max: €${painting.price - 1}`);
        }

        // Show modal
        const modal = document.getElementById('offerModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent body scroll
            setTimeout(() => {
                modal.classList.add('show');
                // Focus first input
                const nameInput = document.getElementById('customerName');
                if (nameInput) nameInput.focus();
            }, 10);
        }
    }

    closeOfferModal() {
        console.log('Closing offer modal');
        const modal = document.getElementById('offerModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore body scroll
            setTimeout(() => {
                modal.classList.add('hidden');
                this.resetOfferForm();
            }, 250);
        }
    }

    resetOfferForm() {
        const form = document.getElementById('offerForm');
        if (form) form.reset();
        
        this.currentOffer = null;
        
        // Reset button state
        const submitBtn = document.getElementById('submitOffer');
        if (submitBtn) {
            submitBtn.disabled = false;
            const submitText = submitBtn.querySelector('.submit-text');
            const loadingText = submitBtn.querySelector('.loading-text');
            if (submitText) submitText.style.display = 'inline';
            if (loadingText) loadingText.style.display = 'none';
        }
    }

    async handleOfferSubmission(e) {
        e.preventDefault();
        console.log('Handling offer submission');
        
        if (!this.currentOffer) {
            console.error('No current offer data');
            return;
        }

        const submitBtn = document.getElementById('submitOffer');
        
        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            const submitText = submitBtn.querySelector('.submit-text');
            const loadingText = submitBtn.querySelector('.loading-text');
            if (submitText) submitText.style.display = 'none';
            if (loadingText) loadingText.style.display = 'inline';
        }

        try {
            const offerData = {
                painting_id: this.currentOffer.paintingId,
                painting_title: this.currentOffer.painting.title,
                customer_name: document.getElementById('customerName').value,
                customer_email: document.getElementById('customerEmail').value,
                offer_amount: parseFloat(document.getElementById('offerAmount').value),
                message: document.getElementById('offerMessage').value || '',
                original_price: this.currentOffer.painting.price,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            // Validate offer amount
            if (offerData.offer_amount >= this.currentOffer.painting.price) {
                throw new Error('Offer amount must be less than the original price');
            }

            if (offerData.offer_amount <= 0) {
                throw new Error('Offer amount must be greater than zero');
            }

            // Validate required fields
            if (!offerData.customer_name.trim()) {
                throw new Error('Please enter your name');
            }

            if (!offerData.customer_email.trim()) {
                throw new Error('Please enter your email address');
            }

            // Store offer
            await this.storeOffer(offerData);
            
            this.showMessage('Your offer has been submitted successfully! We will contact you soon.', 'success');
            this.closeOfferModal();

        } catch (error) {
            console.error('Offer submission error:', error);
            this.showMessage(error.message || 'Failed to submit offer. Please try again.', 'error');
            
            // Reset button state
            if (submitBtn) {
                submitBtn.disabled = false;
                const submitText = submitBtn.querySelector('.submit-text');
                const loadingText = submitBtn.querySelector('.loading-text');
                if (submitText) submitText.style.display = 'inline';
                if (loadingText) loadingText.style.display = 'none';
            }
        }
    }

    async storeOffer(offerData) {
        console.log('Storing offer:', offerData);

        // Store in local storage as fallback
        try {
            const offers = JSON.parse(localStorage.getItem('art_offers') || '[]');
            offers.push(offerData);
            localStorage.setItem('art_offers', JSON.stringify(offers));
            console.log('Offer stored locally');
        } catch (error) {
            console.error('Error storing offer locally:', error);
            throw new Error('Failed to store offer locally');
        }

        // Try to store in Supabase if available
        if (this.supabase) {
            try {
                const { error } = await this.supabase
                    .from('art_offers')
                    .insert([offerData]);
                
                if (error) {
                    console.warn('Supabase offer insert error:', error);
                } else {
                    console.log('Offer stored in Supabase');
                }
            } catch (error) {
                console.warn('Supabase not available for offer storage:', error);
            }
        }
    }

    showMessage(text, type = 'info') {
        console.log('Showing message:', text, type);
        const container = document.getElementById('messageContainer');
        const content = document.getElementById('messageContent');
        
        if (!container || !content) {
            console.error('Message container not found');
            return;
        }

        content.textContent = text;
        content.className = `message ${type}`;
        
        container.classList.remove('hidden');
        setTimeout(() => container.classList.add('show'), 10);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            container.classList.remove('show');
            setTimeout(() => container.classList.add('hidden'), 250);
        }, 5000);
    }

    initScrollAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-animation');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe elements when they're added to DOM
        setTimeout(() => {
            document.querySelectorAll('.painting-card').forEach(card => {
                observer.observe(card);
            });
        }, 100);
    }
}

// Utility functions for admin/debugging
window.ArtGalleryUtils = {
    getOffers: () => {
        return JSON.parse(localStorage.getItem('art_offers') || '[]');
    },
    
    getPurchases: () => {
        return JSON.parse(localStorage.getItem('art_purchases') || '[]');
    },
    
    clearData: () => {
        localStorage.removeItem('art_offers');
        localStorage.removeItem('art_purchases');
        console.log('Local data cleared');
    },
    
    exportData: () => {
        const data = {
            offers: JSON.parse(localStorage.getItem('art_offers') || '[]'),
            purchases: JSON.parse(localStorage.getItem('art_purchases') || '[]'),
            exported_at: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tampakakiart-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing TampakakiArt Gallery...');
    window.artGallery = new ArtGallery();
    window.artGallery.init();
    
    // Add console helper message
    console.log('🎨 TampakakiArt Gallery loaded!');
    console.log('💡 Use ArtGalleryUtils.getOffers() to view submitted offers');
    console.log('💡 Use ArtGalleryUtils.getPurchases() to view purchases');
    console.log('💡 Use ArtGalleryUtils.exportData() to export all data');
});

// Handle PayPal SDK loading errors
window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('paypal')) {
        console.warn('PayPal SDK loading error:', e);
        document.querySelectorAll('.paypal-loading').forEach(el => {
            el.textContent = 'PayPal Unavailable';
            el.style.background = 'var(--color-secondary)';
        });
    }
});
