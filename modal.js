// Creating and injecting modal structure
const modalContainer = document.createElement('div');
modalContainer.classList.add('modal');
document.body.appendChild(modalContainer);

const modalOverlay = document.createElement('div');
modalOverlay.classList.add('modal-overlay');
document.body.appendChild(modalOverlay);

const modalContent = document.createElement('div');
modalContent.classList.add('modal-content');
modalContainer.appendChild(modalContent);

// Close button for modal
const closeModalBtn = document.createElement('button');
closeModalBtn.classList.add('close-modal');
closeModalBtn.innerHTML = '&times;';
modalContent.appendChild(closeModalBtn);

// Title for modal
const modalTitle = document.createElement('h2');
modalTitle.classList.add('modal-title');
modalContent.appendChild(modalTitle);

// Modal body
const modalBody = document.createElement('div');
modalBody.classList.add('modal-body');
modalContent.appendChild(modalBody);

// Action buttons
const modalActions = document.createElement('div');
modalActions.classList.add('modal-actions');
modalContent.appendChild(modalActions);

const cancelBtn = document.createElement('button');
cancelBtn.classList.add('cancel-btn');
cancelBtn.textContent = 'الغاء';
modalActions.appendChild(cancelBtn);

const confirmBtn = document.createElement('button');
confirmBtn.classList.add('confirm-btn');
confirmBtn.textContent = 'تأكيد';
modalActions.appendChild(confirmBtn);

// Close modal when clicking the close button or overlay
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Function to open modal with custom content
function openModal(title, bodyContent, confirmCallback) {
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyContent;

    // Confirm button logic
    confirmBtn.onclick = () => {
        confirmCallback();
        closeModal();
    };

    // Cancel button logic
    cancelBtn.onclick = closeModal;

    modalContainer.classList.add('active');
    modalOverlay.classList.add('active');
}

// Function to close the modal
function closeModal() {
    modalContainer.classList.remove('active');
    modalOverlay.classList.remove('active');
}

// Export modal functions
export { openModal, closeModal };
