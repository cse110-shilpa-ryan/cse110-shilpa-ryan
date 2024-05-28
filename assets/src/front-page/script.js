

// Define the function to edit the iframe content
function editIFrame() {
    var frame = document.querySelector("iframe");
    // Check if the iframe exists
    if (frame) {
        // Add an event listener to execute the editIFrame function when the iframe is loaded
        frame.addEventListener('load', function() {
            // Access the contentDocument of the iframe
            var contentDocument = frame.contentDocument || frame.contentWindow.document;
            // Find and remove the header and footer elements from the iframe content
            var header = contentDocument.querySelector("header");
            if (header) {
                header.remove();
            }
            var footer = contentDocument.querySelector("footer");
            if (footer) {
                footer.remove();
            }
        });
    }
}

// Add an event listener to execute the editIFrame function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', editIFrame);

