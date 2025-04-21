/**
 * PCI-compliant card form helper
 */

/**
 * Generate secure card form HTML
 * @param {string} merchantId - Merchant ID
 * @param {string} transactionId - Transaction ID
 * @param {number} amount - Transaction amount
 * @param {string} currency - Currency code
 * @returns {string} HTML form content
 */
function generateCardFormHtml(merchantId, transactionId, amount, currency = 'KES') {
    // This is a simplified version for MVP
    // In production, this would be a more robust form with proper styling and validation
    
    return `
      <div class="card-payment-form">
        <form id="payment-form" data-transaction-id="${transactionId}" data-merchant-id="${merchantId}">
          <div class="form-group">
            <label for="card-number">Card Number</label>
            <input type="text" id="card-number" placeholder="1234 5678 9012 3456" autocomplete="cc-number" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="expiry-date">Expiry Date</label>
              <input type="text" id="expiry-date" placeholder="MM/YY" autocomplete="cc-exp" required>
            </div>
            
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input type="text" id="cvv" placeholder="123" autocomplete="cc-csc" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="cardholder-name">Cardholder Name</label>
            <input type="text" id="cardholder-name" placeholder="Jane Doe" autocomplete="cc-name" required>
          </div>
          
          <div class="amount-display">
            Amount: ${currency} ${amount.toFixed(2)}
          </div>
          
          <button type="submit" class="pay-button">Pay Now</button>
        </form>
        
        <script>
          // This would be replaced with actual payment processing JS in production
          document.getElementById('payment-form').addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Collect form data
            const cardData = {
              number: document.getElementById('card-number').value.replace(/\\s+/g, ''),
              expiry: document.getElementById('expiry-date').value,
              cvv: document.getElementById('cvv').value,
              name: document.getElementById('cardholder-name').value,
              transactionId: this.dataset.transactionId,
              merchantId: this.dataset.merchantId
            };
            
            // In production, would tokenize card details client-side
            // and then submit only the token to the server
            
            // Simulate API call
            fetch('/api/card/process', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(cardData)
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                window.location.href = '/payment/success?id=' + data.transactionId;
              } else {
                alert('Payment failed: ' + data.message);
              }
            })
            .catch(error => {
              console.error('Error:', error);
              alert('Payment processing error. Please try again.');
            });
          });
        </script>
      </div>
    `;
  }
  
  /**
   * Generate iframe URL for PCI-compliant hosted payment page
   * @param {string} merchantId - Merchant ID
   * @param {string} transactionId - Transaction ID
   * @param {number} amount - Transaction amount
   * @param {string} currency - Currency code
   * @param {string} returnUrl - URL to return to after payment
   * @returns {string} Hosted payment page URL
   */
  function generateHostedPaymentUrl(merchantId, transactionId, amount, currency = 'KES', returnUrl) {
    // This is a simplified version for MVP
    // In production, this would generate a signed URL for a hosted payment page
    
    const baseUrl = '/payment/hosted';
    const params = new URLSearchParams({
      mid: merchantId,
      tid: transactionId,
      amount,
      currency,
      return: returnUrl
    });
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  module.exports = {
    generateCardFormHtml,
    generateHostedPaymentUrl
  };