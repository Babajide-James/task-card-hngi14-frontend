document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const card = document.querySelector(".task-card");
  const displayView = document.querySelector(".task-display");
  const editForm = document.querySelector(".task-edit-form");
  
  const titleDisplay = document.querySelector(".task-title");
  const descDisplay = document.querySelector(".task-description");
  const priorityBadge = document.querySelector(".badge");
  const priorityIndicator = document.querySelector(".priority-indicator");
  const dueDateDisplay = document.querySelector(".due-date");
  const timeRemainingElement = document.getElementById("time-remaining-element");
  const overdueIndicator = document.querySelector(".overdue-indicator");
  
  const statusElement = document.getElementById("status-element");
  const statusDot = document.querySelector(".status-dot");
  const statusControl = document.querySelector(".status-control");
  
  const checkbox = document.getElementById("complete-task");
  const checkboxText = document.getElementById("checkbox-text");
  
  const editBtn = document.querySelector(".edit-btn");
  const deleteBtn = document.querySelector(".delete-btn");

  const expandToggle = document.querySelector(".expand-toggle");
  const collapsibleSection = document.querySelector(".collapsible-section");

  // Form Inputs
  const editTitle = document.getElementById("edit-title");
  const editDesc = document.getElementById("edit-desc");
  const editPriority = document.getElementById("edit-priority");
  const editDue = document.getElementById("edit-due");
  const btnCancel = document.querySelector(".btn-cancel");
  
  // State
  let state = {
    title: "Finalize Q2 Roadmap Design",
    description: "Review and finalize the highly anticipated Q2 roadmap design. Ensure alignment with accessibility guidelines, testability criteria, and the new visual identity. Extra text to demonstrate the collapsible feature.",
    priority: "high", // low, medium, high
    dueDate: "2026-04-15T14:30",
    status: "In Progress" // Pending, In Progress, Done
  };

  let timeInterval;

  // 1. Time Remaining calculation
  const updateTimeRemaining = () => {
    if (state.status === "Done") {
      timeRemainingElement.textContent = "Completed";
      timeRemainingElement.className = "time-remaining safe";
      overdueIndicator.classList.add("hidden");
      return;
    }

    const targetDate = new Date(state.dueDate);
    const now = new Date();
    const diffMs = targetDate - now;

    let hintText = "";
    let isOverdue = false;

    if (diffMs <= 0) {
      isOverdue = true;
      const totalMins = Math.abs(Math.floor(diffMs / (1000 * 60)));
      const hoursOverdue = Math.floor(totalMins / 60);
      
      if (hoursOverdue > 24) {
        const days = Math.floor(hoursOverdue / 24);
        hintText = `Overdue by ${days} day${days > 1 ? "s" : ""}`;
      } else if (hoursOverdue > 0) {
        hintText = `Overdue by ${hoursOverdue} hour${hoursOverdue > 1 ? "s" : ""}`;
      } else {
        hintText = `Overdue by ${Math.max(1, totalMins)} min${totalMins !== 1 ? "s" : ""}`;
      }
      timeRemainingElement.className = "time-remaining danger";
    } else {
      const totalMins = Math.floor(diffMs / (1000 * 60));
      const hoursRemaining = Math.floor(totalMins / 60);
      const daysRemaining = Math.floor(hoursRemaining / 24);
      const minsRemaining = totalMins % 60;

      if (daysRemaining > 1) {
        hintText = `Due in ${daysRemaining} days`;
        timeRemainingElement.className = "time-remaining safe";
      } else if (daysRemaining === 1) {
        hintText = "Due tomorrow";
        timeRemainingElement.className = "time-remaining"; 
      } else if (hoursRemaining > 0) {
        hintText = `Due in ${hoursRemaining} hour${hoursRemaining > 1 ? "s" : ""}`;
        timeRemainingElement.className = "time-remaining danger";
      } else {
        hintText = `Due in ${Math.max(1, minsRemaining)} min${minsRemaining !== 1 ? "s" : ""}`;
        timeRemainingElement.className = "time-remaining danger";
      }
    }

    timeRemainingElement.textContent = hintText;
    
    if (isOverdue) {
      overdueIndicator.classList.remove("hidden");
    } else {
      overdueIndicator.classList.add("hidden");
    }
  };

  const startTimeLoop = () => {
    updateTimeRemaining();
    clearInterval(timeInterval);
    timeInterval = setInterval(updateTimeRemaining, 30000); // 30s as per requirement
  };

  // 2. Expand/Collapse Logic
  const checkCollapsible = () => {
    // Wait for layout
    setTimeout(() => {
      const p = descDisplay;
      collapsibleSection.classList.add("collapsed");
      if (p.scrollHeight > 55 || p.textContent.length > 100) {
        expandToggle.classList.remove("hidden");
      } else {
        expandToggle.classList.add("hidden");
        collapsibleSection.classList.remove("collapsed");
      }
    }, 10);
  };

  expandToggle.addEventListener("click", () => {
    const isCollapsed = collapsibleSection.classList.contains("collapsed");
    if (isCollapsed) {
      collapsibleSection.classList.remove("collapsed");
      expandToggle.textContent = "Show less";
      expandToggle.setAttribute("aria-expanded", "true");
    } else {
      collapsibleSection.classList.add("collapsed");
      expandToggle.textContent = "Show more";
      expandToggle.setAttribute("aria-expanded", "false");
    }
  });

  // 3. Render View UI from State
  const renderView = () => {
    titleDisplay.textContent = state.title;
    descDisplay.textContent = state.description;
    
    // Priority
    priorityBadge.className = `badge priority-${state.priority}`;
    priorityBadge.textContent = `${state.priority.charAt(0).toUpperCase() + state.priority.slice(1)} Priority`;
    priorityIndicator.className = `priority-indicator priority-indicator-${state.priority}`;
    
    const d = new Date(state.dueDate);
    if (!isNaN(d.getTime())) {
      dueDateDisplay.textContent = d.toLocaleString();
    }

    // Status sync
    statusElement.textContent = state.status;
    statusControl.value = state.status;
    
    if (state.status === "Done") {
      card.classList.add("is-completed");
      statusDot.className = "status-dot done";
      checkbox.checked = true;
      checkboxText.textContent = "Completed";
    } else if (state.status === "In Progress") {
      card.classList.remove("is-completed");
      statusDot.className = "status-dot in-progress";
      checkbox.checked = false;
      checkboxText.textContent = "Mark as Done";
    } else {
      card.classList.remove("is-completed");
      statusDot.className = "status-dot pending";
      checkbox.checked = false;
      checkboxText.textContent = "Mark as Done";
    }

    startTimeLoop();
    checkCollapsible();
  };

  // Status Change Logic
  const handleStatusChange = (newStatus) => {
    state.status = newStatus;
    renderView();
  };

  checkbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      handleStatusChange("Done");
    } else {
      handleStatusChange("Pending"); // If unchecked after done, revert to pending
    }
  });

  statusControl.addEventListener("change", (e) => {
    handleStatusChange(e.target.value);
  });

  // 4. Edit Mode Logic
  editBtn.addEventListener("click", () => {
    // Populate form
    editTitle.value = state.title;
    editDesc.value = state.description;
    editPriority.value = state.priority;
    editDue.value = state.dueDate;

    displayView.classList.add("hidden");
    editForm.classList.remove("hidden");
    editTitle.focus();
  });

  btnCancel.addEventListener("click", () => {
    editForm.classList.add("hidden");
    displayView.classList.remove("hidden");
    editBtn.focus();
  });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    state.title = editTitle.value;
    state.description = editDesc.value;
    state.priority = editPriority.value;
    state.dueDate = editDue.value;

    editForm.classList.add("hidden");
    displayView.classList.remove("hidden");
    
    renderView();
    editBtn.focus();
  });

  deleteBtn.addEventListener("click", () => {
    alert("Delete clicked");
  });

  // Initial render
  setTimeout(() => {
    renderView();
  }, 0);
});
