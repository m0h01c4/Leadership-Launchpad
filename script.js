// Experience Leadership Launchpad - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeFilters();
    initializeTemplates();
    initializeSmoothScrolling();
});

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const resourceCards = document.querySelectorAll('.resource-card');
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        resourceCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          tags.some(tag => tag.includes(searchTerm));
            
            if (matches || searchTerm === '') {
                card.style.display = 'block';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });
        
        // Show/hide no results message
        const visibleCards = Array.from(resourceCards).filter(card => 
            !card.classList.contains('hidden') && card.style.display !== 'none'
        );
        
        updateNoResultsMessage(visibleCards.length === 0 && searchTerm !== '');
    });
}

// Filter functionality
function initializeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const resourceCards = document.querySelectorAll('.resource-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter resources
            resourceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                } else {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }
            });
            
            // Clear search when filtering
            const searchInput = document.getElementById('searchInput');
            searchInput.value = '';
            
            // Update no results message
            const visibleCards = Array.from(resourceCards).filter(card => 
                !card.classList.contains('hidden') && card.style.display !== 'none'
            );
            updateNoResultsMessage(visibleCards.length === 0);
        });
    });
}

// No results message
function updateNoResultsMessage(show) {
    let noResultsMessage = document.getElementById('noResultsMessage');
    
    if (show && !noResultsMessage) {
        noResultsMessage = document.createElement('div');
        noResultsMessage.id = 'noResultsMessage';
        noResultsMessage.className = 'no-results';
        noResultsMessage.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #64748b;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No resources found</h3>
                <p>Try adjusting your search terms or filters</p>
            </div>
        `;
        document.getElementById('resourcesGrid').appendChild(noResultsMessage);
    } else if (!show && noResultsMessage) {
        noResultsMessage.remove();
    }
}

// Template functionality
function initializeTemplates() {
    // Template definitions
    window.templates = {
        '1on1': {
            title: '1-on-1 Meeting Template',
            content: `
                <h3>1-on-1 Meeting Template</h3>
                <div class="template-content">
                    <h4>Pre-Meeting Preparation</h4>
                    <ul>
                        <li>Review previous meeting notes</li>
                        <li>Prepare agenda items</li>
                        <li>Consider employee's recent work and challenges</li>
                    </ul>
                    
                    <h4>Meeting Agenda</h4>
                    <div class="agenda-section">
                        <h5>1. Check-in (5 minutes)</h5>
                        <ul>
                            <li>How are you feeling about work lately?</li>
                            <li>What's going well for you?</li>
                            <li>Any immediate concerns or blockers?</li>
                        </ul>
                    </div>
                    
                    <div class="agenda-section">
                        <h5>2. Performance Discussion (15 minutes)</h5>
                        <ul>
                            <li>Progress on current projects and goals</li>
                            <li>Challenges and how to overcome them</li>
                            <li>Recognition of achievements</li>
                        </ul>
                    </div>
                    
                    <div class="agenda-section">
                        <h5>3. Development & Growth (10 minutes)</h5>
                        <ul>
                            <li>Skills development opportunities</li>
                            <li>Career aspirations and path</li>
                            <li>Learning resources and support needed</li>
                        </ul>
                    </div>
                    
                    <div class="agenda-section">
                        <h5>4. Team & Process (5 minutes)</h5>
                        <ul>
                            <li>Team dynamics and collaboration</li>
                            <li>Process improvements</li>
                            <li>Resource needs</li>
                        </ul>
                    </div>
                    
                    <div class="agenda-section">
                        <h5>5. Action Items & Next Steps (5 minutes)</h5>
                        <ul>
                            <li>Summarize key discussion points</li>
                            <li>Define action items with owners and deadlines</li>
                            <li>Schedule next meeting</li>
                        </ul>
                    </div>
                    
                    <h4>Post-Meeting</h4>
                    <ul>
                        <li>Send meeting summary with action items</li>
                        <li>Follow up on commitments made</li>
                        <li>Document insights for next meeting</li>
                    </ul>
                </div>
            `
        },
        'goals': {
            title: 'SMART Goals Framework',
            content: `
                <h3>SMART Goals Framework</h3>
                <div class="template-content">
                    <h4>SMART Criteria</h4>
                    <div class="smart-criteria">
                        <div class="criteria-item">
                            <h5><strong>S</strong>pecific</h5>
                            <p>Clear and well-defined. What exactly needs to be accomplished?</p>
                        </div>
                        <div class="criteria-item">
                            <h5><strong>M</strong>easurable</h5>
                            <p>Quantifiable metrics to track progress and success.</p>
                        </div>
                        <div class="criteria-item">
                            <h5><strong>A</strong>chievable</h5>
                            <p>Realistic and attainable given available resources.</p>
                        </div>
                        <div class="criteria-item">
                            <h5><strong>R</strong>elevant</h5>
                            <p>Aligned with broader objectives and meaningful to the individual/team.</p>
                        </div>
                        <div class="criteria-item">
                            <h5><strong>T</strong>ime-bound</h5>
                            <p>Clear deadline or timeframe for completion.</p>
                        </div>
                    </div>
                    
                    <h4>Goal Setting Template</h4>
                    <div class="goal-template">
                        <div class="template-field">
                            <h5>Goal Statement:</h5>
                            <p><em>Write a clear, specific statement of what you want to achieve.</em></p>
                        </div>
                        
                        <div class="template-field">
                            <h5>Success Metrics:</h5>
                            <p><em>How will you measure success? What are the key indicators?</em></p>
                        </div>
                        
                        <div class="template-field">
                            <h5>Action Steps:</h5>
                            <p><em>Break down the goal into specific, actionable steps.</em></p>
                        </div>
                        
                        <div class="template-field">
                            <h5>Resources Needed:</h5>
                            <p><em>What resources, support, or tools are required?</em></p>
                        </div>
                        
                        <div class="template-field">
                            <h5>Timeline:</h5>
                            <p><em>Set milestones and final deadline.</em></p>
                        </div>
                        
                        <div class="template-field">
                            <h5>Potential Obstacles:</h5>
                            <p><em>What challenges might arise and how will you address them?</em></p>
                        </div>
                    </div>
                    
                    <h4>Review Schedule</h4>
                    <ul>
                        <li><strong>Weekly:</strong> Progress check and adjustment</li>
                        <li><strong>Monthly:</strong> Comprehensive review and course correction</li>
                        <li><strong>Quarterly:</strong> Major milestone assessment</li>
                    </ul>
                </div>
            `
        },
        'performance': {
            title: 'Performance Review Guide',
            content: `
                <h3>Performance Review Guide</h3>
                <div class="template-content">
                    <h4>Preparation Phase</h4>
                    <ul>
                        <li>Gather performance data and examples</li>
                        <li>Review previous goals and objectives</li>
                        <li>Collect 360-degree feedback</li>
                        <li>Prepare specific examples of achievements and areas for improvement</li>
                    </ul>
                    
                    <h4>Review Structure</h4>
                    
                    <div class="review-section">
                        <h5>1. Performance Against Goals (20 minutes)</h5>
                        <ul>
                            <li>Review each goal set in the previous period</li>
                            <li>Discuss achievements and challenges</li>
                            <li>Analyze factors that contributed to success or barriers</li>
                        </ul>
                    </div>
                    
                    <div class="review-section">
                        <h5>2. Core Competencies Assessment (15 minutes)</h5>
                        <ul>
                            <li>Leadership and management skills</li>
                            <li>Communication and collaboration</li>
                            <li>Problem-solving and decision-making</li>
                            <li>Innovation and adaptability</li>
                        </ul>
                    </div>
                    
                    <div class="review-section">
                        <h5>3. Strengths and Development Areas (10 minutes)</h5>
                        <ul>
                            <li>Highlight key strengths with specific examples</li>
                            <li>Identify development opportunities</li>
                            <li>Discuss how to leverage strengths more effectively</li>
                        </ul>
                    </div>
                    
                    <div class="review-section">
                        <h5>4. Goal Setting for Next Period (10 minutes)</h5>
                        <ul>
                            <li>Set 3-5 SMART goals for the upcoming period</li>
                            <li>Align goals with organizational objectives</li>
                            <li>Discuss support and resources needed</li>
                        </ul>
                    </div>
                    
                    <div class="review-section">
                        <h5>5. Development Planning (10 minutes)</h5>
                        <ul>
                            <li>Identify learning and development opportunities</li>
                            <li>Discuss career aspirations</li>
                            <li>Create action plan for skill development</li>
                        </ul>
                    </div>
                    
                    <h4>Performance Rating Scale</h4>
                    <div class="rating-scale">
                        <div class="rating-item">
                            <strong>Exceeds Expectations:</strong> Consistently delivers exceptional results beyond what is expected
                        </div>
                        <div class="rating-item">
                            <strong>Meets Expectations:</strong> Consistently meets all job requirements and objectives
                        </div>
                        <div class="rating-item">
                            <strong>Partially Meets Expectations:</strong> Generally meets expectations with some areas needing improvement
                        </div>
                        <div class="rating-item">
                            <strong>Below Expectations:</strong> Consistently falls short of meeting basic job requirements
                        </div>
                    </div>
                    
                    <h4>Follow-up Actions</h4>
                    <ul>
                        <li>Document key discussion points and agreements</li>
                        <li>Share written summary with employee</li>
                        <li>Schedule regular check-ins to monitor progress</li>
                        <li>Implement development plan actions</li>
                    </ul>
                </div>
            `
        },
        'feedback': {
            title: 'Feedback Framework',
            content: `
                <h3>Effective Feedback Framework</h3>
                <div class="template-content">
                    <h4>SBI Model (Situation-Behavior-Impact)</h4>
                    
                    <div class="sbi-model">
                        <div class="sbi-item">
                            <h5><strong>Situation</strong></h5>
                            <p>Describe the specific situation or context where the behavior occurred.</p>
                            <em>Example: "During yesterday's team meeting when we were discussing the project timeline..."</em>
                        </div>
                        
                        <div class="sbi-item">
                            <h5><strong>Behavior</strong></h5>
                            <p>Describe the specific, observable behavior (avoid interpretations or assumptions).</p>
                            <em>Example: "...you interrupted Sarah twice while she was presenting her analysis..."</em>
                        </div>
                        
                        <div class="sbi-item">
                            <h5><strong>Impact</strong></h5>
                            <p>Explain the impact of the behavior on you, the team, or the situation.</p>
                            <em>Example: "...which seemed to discourage her from sharing her full perspective, and we missed some important insights."</em>
                        </div>
                    </div>
                    
                    <h4>Types of Feedback</h4>
                    
                    <div class="feedback-types">
                        <div class="feedback-type">
                            <h5>Reinforcing Feedback (Positive)</h5>
                            <ul>
                                <li>Recognizes and reinforces effective behavior</li>
                                <li>Increases likelihood of behavior repetition</li>
                                <li>Should be specific and timely</li>
                            </ul>
                        </div>
                        
                        <div class="feedback-type">
                            <h5>Redirecting Feedback (Constructive)</h5>
                            <ul>
                                <li>Addresses behavior that needs improvement</li>
                                <li>Focuses on specific behaviors, not personality</li>
                                <li>Includes suggestions for improvement</li>
                            </ul>
                        </div>
                    </div>
                    
                    <h4>Feedback Best Practices</h4>
                    
                    <h5>Before Giving Feedback:</h5>
                    <ul>
                        <li>Choose the right time and place</li>
                        <li>Prepare specific examples</li>
                        <li>Consider the recipient's perspective</li>
                        <li>Set a constructive intention</li>
                    </ul>
                    
                    <h5>During the Conversation:</h5>
                    <ul>
                        <li>Start with context and intention</li>
                        <li>Use the SBI model</li>
                        <li>Listen actively to their response</li>
                        <li>Collaborate on solutions</li>
                        <li>End with clear next steps</li>
                    </ul>
                    
                    <h5>After the Conversation:</h5>
                    <ul>
                        <li>Follow up on agreed actions</li>
                        <li>Monitor progress</li>
                        <li>Provide ongoing support</li>
                        <li>Recognize improvements</li>
                    </ul>
                    
                    <h4>Receiving Feedback</h4>
                    <ul>
                        <li><strong>Listen actively:</strong> Focus on understanding, not defending</li>
                        <li><strong>Ask clarifying questions:</strong> Ensure you understand the feedback</li>
                        <li><strong>Acknowledge:</strong> Thank the person for their input</li>
                        <li><strong>Reflect:</strong> Take time to process the feedback</li>
                        <li><strong>Act:</strong> Develop a plan to address the feedback</li>
                    </ul>
                    
                    <h4>Feedback Conversation Template</h4>
                    <div class="conversation-template">
                        <p><strong>Opening:</strong> "I'd like to share some feedback about [situation] because I believe it will help us work more effectively together."</p>
                        
                        <p><strong>SBI:</strong> Use the Situation-Behavior-Impact model</p>
                        
                        <p><strong>Inquiry:</strong> "What's your perspective on this?" or "Help me understand your thinking."</p>
                        
                        <p><strong>Collaboration:</strong> "How can we work together to address this?" or "What would help you succeed in this area?"</p>
                        
                        <p><strong>Closing:</strong> "Let's check in next week to see how things are going."</p>
                    </div>
                </div>
            `
        }
    };
}

// Template modal functions
function openTemplate(templateId) {
    const template = window.templates[templateId];
    if (template) {
        const modal = document.getElementById('templateModal');
        const modalContent = document.getElementById('modalContent');
        
        modalContent.innerHTML = template.content;
        modal.style.display = 'block';
        
        // Add print button
        const printButton = document.createElement('button');
        printButton.className = 'btn btn-primary';
        printButton.innerHTML = '<i class="fas fa-print"></i> Print Template';
        printButton.onclick = () => printTemplate(template.title);
        modalContent.appendChild(printButton);
    }
}

function closeModal() {
    document.getElementById('templateModal').style.display = 'none';
}

// Roadmap modal functions
function openRoadmapPopup() {
    const modal = document.getElementById('roadmapModal');
    modal.style.display = 'block';
}

function closeRoadmapModal() {
    document.getElementById('roadmapModal').style.display = 'none';
}

function downloadRoadmap() {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = 'Experience Talent Roadmap (2).pdf';
    link.download = 'Experience Talent Roadmap (2).pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Talking Points modal functions
function openTalkingPointsPopup() {
    const modal = document.getElementById('talkingPointsModal');
    modal.style.display = 'block';
}

function closeTalkingPointsModal() {
    document.getElementById('talkingPointsModal').style.display = 'none';
}

function openTalkingPointsResource() {
    // Add your talking points link/resource here
    alert('Talking Points resource will be opened here');
}

function openTalkingPointsDocPopup() {
    const modal = document.getElementById('talkingPointsDocModal');
    modal.style.display = 'block';
}

function closeTalkingPointsDocModal() {
    document.getElementById('talkingPointsDocModal').style.display = 'none';
}

function downloadTalkingPoints() {
    // Create a temporary link element for Talking Points download
    const link = document.createElement('a');
    link.href = 'leadership development talking points.docx';
    link.download = 'leadership development talking points.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function openTAPImagePopup() {
    const modal = document.getElementById('tapImageModal');
    modal.style.display = 'block';
}

function closeTAPImageModal() {
    document.getElementById('tapImageModal').style.display = 'none';
}

function downloadTAP() {
    // Create a temporary link element for TAP PDF download
    const link = document.createElement('a');
    link.href = 'TAP.pdf';
    link.download = 'TAP.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function printTemplate(title) {
    const printContent = document.getElementById('modalContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h3, h4, h5 { color: #333; }
                .template-content { line-height: 1.6; }
                .criteria-item, .sbi-item, .feedback-type { margin-bottom: 15px; }
                .rating-item { margin: 10px 0; padding: 10px; border-left: 3px solid #4f46e5; }
                button { display: none; }
                @media print { button { display: none !important; } }
            </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function downloadResource(filename) {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = filename;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const templateModal = document.getElementById('templateModal');
    const roadmapModal = document.getElementById('roadmapModal');
    const talkingPointsModal = document.getElementById('talkingPointsModal');
    const tapImageModal = document.getElementById('tapImageModal');
    const talkingPointsDocModal = document.getElementById('talkingPointsDocModal');
    
    if (event.target === templateModal) {
        closeModal();
    }
    if (event.target === roadmapModal) {
        closeRoadmapModal();
    }
    if (event.target === talkingPointsModal) {
        closeTalkingPointsModal();
    }
    if (event.target === tapImageModal) {
        closeTAPImageModal();
    }
    if (event.target === talkingPointsDocModal) {
        closeTalkingPointsDocModal();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC key closes modal
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Ctrl/Cmd + K focuses search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// Add loading animation for resource cards
function animateCards() {
    const cards = document.querySelectorAll('.resource-card, .tool-card, .quick-access-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', animateCards);

// Track user engagement (optional analytics)
function trackEngagement() {
    let startTime = Date.now();
    let totalTime = 0;
    
    // Track time spent on page
    window.addEventListener('beforeunload', () => {
        totalTime = Date.now() - startTime;
        console.log(`User spent ${Math.round(totalTime / 1000)} seconds on the page`);
    });
    
    // Track resource clicks
    document.querySelectorAll('.resource-link, .external-link').forEach(link => {
        link.addEventListener('click', (e) => {
            console.log(`User clicked resource: ${e.target.textContent}`);
        });
    });
    
    // Track template usage
    document.querySelectorAll('[onclick^="openTemplate"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const templateId = e.target.getAttribute('onclick').match(/openTemplate\('(.+)'\)/)[1];
            console.log(`User opened template: ${templateId}`);
        });
    });
}