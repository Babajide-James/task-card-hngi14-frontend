document.addEventListener('DOMContentLoaded', () => {
    // 1. Time Remaining calculation
    const timeRemainingElement = document.getElementById('time-remaining-element');
    
    // Set offset to exactly 3 days from now
    const targetDate = new Date(Date.now() + (3 * 24 * 60 * 60 * 1000));
    
    const updateTimeRemaining = () => {
        const now = new Date();
        const diffMs = targetDate - now;
        
        let hintText = "";
        
        if (diffMs <= 0) {
            const hoursOverdue = Math.abs(Math.floor(diffMs / (1000 * 60 * 60)));
            if (hoursOverdue > 24) {
                const days = Math.floor(hoursOverdue / 24);
                hintText = `Overdue by ${days} day${days > 1 ? 's' : ''}`;
            } else if (hoursOverdue > 0) {
                hintText = `Overdue by ${hoursOverdue} hour${hoursOverdue > 1 ? 's' : ''}`;
            } else {
                hintText = "Overdue!";
            }
            timeRemainingElement.className = 'time-remaining danger';
        } else {
            const hoursRemaining = Math.floor(diffMs / (1000 * 60 * 60));
            const daysRemaining = Math.floor(hoursRemaining / 24);
            
            if (daysRemaining > 1) {
                hintText = `Due in ${daysRemaining} days`;
                timeRemainingElement.className = 'time-remaining safe';
            } else if (daysRemaining === 1) {
                hintText = "Due tomorrow";
                timeRemainingElement.className = 'time-remaining'; // defaults to warning color
            } else if (hoursRemaining > 0) {
                hintText = `Due in ${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''}`;
                timeRemainingElement.className = 'time-remaining danger';
            } else {
                hintText = "Due now!";
                timeRemainingElement.className = 'time-remaining danger';
            }
        }
        
        timeRemainingElement.textContent = hintText;
    };

    // Initial call and set interval to update every 60 seconds
    updateTimeRemaining();
    setInterval(updateTimeRemaining, 60000);
    
    // 2. Checkbox handling for completion
    const checkbox = document.getElementById('complete-task');
    const card = document.querySelector('.task-card');
    const statusText = document.getElementById('status-element');
    const statusDot = document.querySelector('.status-dot');
    const checkboxText = document.querySelector('.checkbox-text');
    
    checkbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            card.classList.add('is-completed');
            statusText.textContent = 'Done';
            statusDot.className = 'status-dot done';
            checkboxText.textContent = 'Completed';
            
            // Set priority element screen-reader only changes if needed, but keeping it visible is fine
        } else {
            card.classList.remove('is-completed');
            statusText.textContent = 'In Progress';
            statusDot.className = 'status-dot in-progress';
            checkboxText.textContent = 'Mark as Done';
        }
    });
    
    // 3. Edit & Delete actions
    const editBtn = document.querySelector('.edit-btn');
    const deleteBtn = document.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', () => {
        console.log("Edit clicked");
    });
    
    deleteBtn.addEventListener('click', () => {
        alert("Delete clicked");
    });
});
