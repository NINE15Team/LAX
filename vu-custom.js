// Extract the main function so it can be reused
function initializeAccordions() {
  
  // Target the specific element
  const accordionContainer = document.querySelector('#lead-gen-help-page .accordions');
  
  if (accordionContainer) {
    // Check if this specific container is already initialized
    if (accordionContainer.dataset.accordionInitialized === 'true') {
      
      return;
    }
    
    
    
    // Mark as initialized
    accordionContainer.dataset.accordionInitialized = 'true';
    
    // First, clean up the structure if needed
    cleanupAccordionStructure(accordionContainer);
    
    // Find all heading elements
    const headings = accordionContainer.querySelectorAll('.faq_drop_heading');
    
    // Add click event to each heading
    headings.forEach(heading => {
      // Create a wrapper for each accordion item if not already wrapped
      if (!heading.parentElement.classList.contains('accordion-item-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'accordion-item-wrapper';
        
        // Get the content div that follows the heading
        const content = heading.nextElementSibling;
        if (content && content.tagName === 'DIV') {
          // Insert wrapper before heading
          heading.parentNode.insertBefore(wrapper, heading);
          
          // Move heading and content into wrapper
          wrapper.appendChild(heading);
          wrapper.appendChild(content);
          
          // Initially hide content with height 0 instead of display:none
          content.classList.add('accordion-content');
          content.style.maxHeight = '0';
          content.style.overflow = 'hidden';
        }
      }
      
      // Add click event listener (only if not already added)
      if (!heading.dataset.clickAdded) {
        heading.dataset.clickAdded = 'true';
        heading.addEventListener('click', function() {
          // Toggle active class
          this.classList.toggle('active');
          
          // Find the content div
          const content = this.nextElementSibling;
          if (content && content.classList.contains('accordion-content')) {
            if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
              content.style.maxHeight = content.scrollHeight + 'px';
            } else {
              content.style.maxHeight = '0';
            }
          }
        });
      }
    });
    
    // Add CSS for the accordions (only if not already added)
    if (!document.querySelector('#accordion-styles')) {
      const style = document.createElement('style');
      style.id = 'accordion-styles';
      style.textContent = `
        #lead-gen-help-page .accordions {
          width: 100%;
          max-width: 950px;
          margin: 30px auto;
        }
        
        #lead-gen-help-page .accordion-item-wrapper {
          width: 100%;
          display: block;
          margin-bottom: 15px;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }
        
        #lead-gen-help-page .accordions .faq_drop_heading {
          cursor: pointer;
          position: relative;
          padding-right: 30px;
          margin-bottom: 10px;
          width: 100%;
          display: block;
          box-sizing: border-box;
          color: #c12026;
          font-weight: bold;
          
        }
        #lead-gen-help-page .accordions .faq_drop_heading strong{
          text-transform: uppercase;
        }
        
        #lead-gen-help-page .accordions .faq_drop_heading::after {
          content: '';
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 16px;
          background-image: url("data:image/svg+xml,%3Csvg width='18' height='16' viewBox='0 0 18 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 12L9 4L17 12' stroke='%23C7132D' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: center;
          transition: transform 0.3s ease;
        }
        
        #lead-gen-help-page .accordions .faq_drop_heading.active::after {
          transform: translateY(-50%) rotate(180deg);
        }
        
        #lead-gen-help-page .accordions .accordion-content {
          width: 100%;
          box-sizing: border-box;
          transition: max-height 0.3s ease-out;
        }
        
        #lead-gen-help-page .accordions hr {
          display: none;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Move this line inside the if block to avoid the error
    accordionContainer.style.display = "block";
    console.log('Accordions initialized successfully');
  } else {
    console.log('Accordion container not found');
  }
  
  // Function to clean up accordion structure
  function cleanupAccordionStructure(container) {
    // If headings don't have the proper class, add it
    container.querySelectorAll('h2').forEach(heading => {
      if (!heading.classList.contains('faq_drop_heading')) {
        heading.classList.add('faq_drop_heading');
      }
    });
    
    // Remove any empty divs or divs with only <br> tags
    container.querySelectorAll('div').forEach(div => {
      if (!div.classList.contains('accordion-item-wrapper') && 
          (div.innerHTML.trim() === '' || div.innerHTML.trim() === '<br>' || div.innerHTML.trim() === '<br/>')) {
        div.remove();
      }
    });
    
    // Ensure proper structure: each heading should be followed by a content div
    const children = Array.from(container.children);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      
      // If it's a heading
      if (child.classList.contains('faq_drop_heading') || child.tagName === 'H2') {
        // Check if next element is a div for content
        const nextElement = child.nextElementSibling;
        
        // If next element is not a div (might be another heading or hr), create a content div
        if (!nextElement || nextElement.tagName !== 'DIV') {
          const contentDiv = document.createElement('div');
          contentDiv.innerHTML = '<p>Content not available</p>';
          contentDiv.classList.add('accordion-content');
          container.insertBefore(contentDiv, nextElement);
        }
      }
    }
  }
}

// Run on initial page load
document.addEventListener('DOMContentLoaded', initializeAccordions);

// Simple approach: just check periodically if accordion needs to be initialized
setInterval(function() {
  const accordionContainer = document.querySelector('#lead-gen-help-page .accordions');
  if (accordionContainer && !accordionContainer.dataset.accordionInitialized) {
    initializeAccordions();
  }
}, 500); // Check every 500ms

// Also try to catch URL changes if possible
let currentUrl = window.location.href;
setInterval(function() {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    // URL changed, wait a bit then try to initialize
    setTimeout(initializeAccordions, 300);
  }
}, 100);