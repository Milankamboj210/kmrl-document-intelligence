const CONFIG = {
    API_BASE_URL: 'api/',
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    SUPPORTED_FORMATS: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
    AI_API_KEY: 'your-openai-api-key-here', // Replace with actual API key
    DEMO_MODE: true // Set to false when backend is ready
};

// Global state
let currentDocuments = [];
let isAIProcessing = false;
let chatHistory = [];
let currentUserRole = 'admin';
let kmrlData = {
    ridership: {
        daily: 124567,
        monthly: 3.2,
        yearly: 45.6
    },
    revenue: {
        today: 18.7,
        month: 567.2,
        year: 6789.5
    },
    operations: {
        onTimePerformance: 98.2,
        safetyScore: 99.7,
        activeTrains: 24,
        totalStations: 25
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSampleDocuments();
});

function initializeApp() {
    // Initialize navigation
    setupNavigation();
    
    // Load dashboard data
    updateDashboardStats();
    
    // Setup drag and drop for upload
    setupDragAndDrop();
    
    // Initialize AI chat
    initializeAIChat();
    
    // Setup search functionality
    setupSmartSearch();
    
console.log('Kerala Metro DMS initialized successfully');
    
    // Load role-specific AI summaries
    loadRoleBasedSummaries();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // File input
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Search input
    const searchInput = document.getElementById('smart-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performAISearch();
            }
        });
    }
    
    // Chat input
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    // Filters
    document.querySelectorAll('.filters select').forEach(filter => {
        filter.addEventListener('change', filterDocuments);
    });
}

function setupNavigation() {
    function handleNavigation(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        showSection(targetId);
    }
    
    // Attach to all navigation links
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active nav link
    document.querySelectorAll('.nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.nav a[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Dashboard functionality
function updateDashboardStats() {
    const stats = {
        totalDocs: Math.floor(Math.random() * 2000) + 1000,
        aiProcessed: Math.floor(Math.random() * 1500) + 500,
        pendingReview: Math.floor(Math.random() * 100) + 10,
        activeUsers: Math.floor(Math.random() * 50) + 10
    };
    
    animateCounter('total-docs', stats.totalDocs);
    animateCounter('ai-processed', stats.aiProcessed);
    animateCounter('pending-review', stats.pendingReview);
    animateCounter('active-users', stats.activeUsers);
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let currentValue = 0;
    const increment = targetValue / 50;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue).toLocaleString();
    }, 30);
}

// AI Chat functionality
function initializeAIChat() {
    chatHistory = [
        {
            type: 'ai',
            message: "Hello! I'm your Kerala Metro AI assistant. I can help you organize documents, find information, and automate tasks. How can I assist you today?"
        }
    ];
}

function openAIChat() {
    document.getElementById('ai-chat-modal').style.display = 'block';
    document.getElementById('chat-input').focus();
}

function closeAIChat() {
    document.getElementById('ai-chat-modal').style.display = 'none';
}

async function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addChatMessage('user', message);
    chatInput.value = '';
    
    // Show AI thinking
    const thinkingId = addChatMessage('ai', '<div class="loading"></div> Thinking...');
    
    try {
        // Simulate AI response (replace with actual API call)
        const aiResponse = await getAIResponse(message);
        
        // Remove thinking message and add actual response
        removeChatMessage(thinkingId);
        addChatMessage('ai', aiResponse);
        
    } catch (error) {
        removeChatMessage(thinkingId);
        addChatMessage('ai', 'Sorry, I encountered an error. Please try again.');
        console.error('AI Chat error:', error);
    }
}

function addChatMessage(type, message) {
    const chatContainer = document.getElementById('chat-container');
    const messageId = 'msg-' + Date.now();
    
    const messageHTML = `
        <div class="${type}-message" id="${messageId}">
            <div class="message-avatar">
                <i class="fas fa-${type === 'ai' ? 'robot' : 'user'}"></i>
            </div>
            <div class="message-content">
                ${message}
            </div>
        </div>
    `;
    
    chatContainer.insertAdjacentHTML('beforeend', messageHTML);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    return messageId;
}

function removeChatMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
        message.remove();
    }
}

async function getAIResponse(userMessage) {
    // This is a demo function - replace with actual AI API integration
    const responses = {
        'help': "I can help you with document organization, search, classification, and analysis. Try asking me to 'find tender documents' or 'classify recent uploads'.",
        'search': "I can perform intelligent searches across your documents. What specific documents are you looking for?",
        'classify': "I can automatically classify documents by type, priority, and department. Would you like me to run classification on recent uploads?",
        'summary': "I can generate summaries of long documents. Which document would you like me to summarize?",
        'default': "I understand you're asking about document management. I can help with searching, organizing, classifying, and analyzing your Kerala Metro documents. What specific task would you like assistance with?"
    };
    
    // Simple keyword matching for demo
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return responses.help;
    } else if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
        return responses.search;
    } else if (lowerMessage.includes('classify') || lowerMessage.includes('categorize')) {
        return responses.classify;
    } else if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
        return responses.summary;
    } else {
        return responses.default;
    }
}

// Smart Search functionality
function setupSmartSearch() {
    const searchInput = document.getElementById('smart-search');
    
    // Sample search suggestions
    const suggestions = [
        "Find all tender documents from 2024",
        "Show safety reports requiring review",
        "List all financial documents over 1 crore",
        "Find documents mentioning 'Phase 2' expansion",
        "Show all compliance certificates",
        "Find documents uploaded this week"
    ];
    
    searchInput.addEventListener('focus', () => {
        showSearchSuggestions(suggestions);
    });
    
    searchInput.addEventListener('blur', () => {
        setTimeout(() => hideSearchSuggestions(), 200);
    });
}

function handleSearchInput(e) {
    const query = e.target.value;
    if (query.length < 2) {
        hideSearchSuggestions();
        return;
    }
    
    // Filter suggestions based on input
    const suggestions = [
        "Find all tender documents from 2024",
        "Show safety reports requiring review",
        "List all financial documents over 1 crore",
        "Find documents mentioning 'Phase 2' expansion",
        "Show all compliance certificates",
        "Find documents uploaded this week"
    ].filter(s => s.toLowerCase().includes(query.toLowerCase()));
    
    showSearchSuggestions(suggestions);
}

function showSearchSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (suggestions.length === 0) {
        hideSearchSuggestions();
        return;
    }
    
    const suggestionsHTML = suggestions.map(suggestion => 
        `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">${suggestion}</div>`
    ).join('');
    
    suggestionsContainer.innerHTML = suggestionsHTML;
    suggestionsContainer.classList.add('active');
}

function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    suggestionsContainer.classList.remove('active');
}

function selectSuggestion(suggestion) {
    document.getElementById('smart-search').value = suggestion;
    hideSearchSuggestions();
    performAISearch();
}

async function performAISearch() {
    const query = document.getElementById('smart-search').value;
    if (!query.trim()) return;
    
    showNotification('AI Search initiated...', 'info');
    
    try {
        // Simulate AI search processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Filter documents based on query (demo)
        const filteredDocs = currentDocuments.filter(doc => 
            doc.title.toLowerCase().includes(query.toLowerCase()) ||
            doc.category.toLowerCase().includes(query.toLowerCase()) ||
            doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        
        displayDocuments(filteredDocs);
        showNotification(`Found ${filteredDocs.length} documents matching your query`, 'success');
        
    } catch (error) {
        showNotification('Search failed. Please try again.', 'error');
        console.error('Search error:', error);
    }
}

// Document management
function loadSampleDocuments() {
    // Sample documents for demo
    currentDocuments = [
        {
            id: 1,
            title: "Tender KM-2024-001 - Track Construction",
            category: "tenders",
            dateAdded: "2024-08-25",
            size: "2.3 MB",
            aiConfidence: "96%",
            tags: ["Phase-2", "Construction", "Track", "AI-Classified"],
            thumbnail: "fas fa-file-pdf",
            status: "active",
            priority: "high"
        },
        {
            id: 2,
            title: "Safety Compliance Report Q3-2024",
            category: "safety",
            dateAdded: "2024-08-20",
            size: "1.8 MB",
            aiConfidence: "94%",
            tags: ["Safety", "Compliance", "Q3-2024", "AI-Analyzed"],
            thumbnail: "fas fa-file-alt",
            status: "pending",
            priority: "medium"
        },
        {
            id: 3,
            title: "Financial Budget Allocation 2024-25",
            category: "finance",
            dateAdded: "2024-08-15",
            size: "3.1 MB",
            aiConfidence: "98%",
            tags: ["Budget", "Finance", "2024-25", "AI-Reviewed"],
            thumbnail: "fas fa-file-excel",
            status: "active",
            priority: "high"
        },
        {
            id: 4,
            title: "Engineering Specifications - Station Design",
            category: "engineering",
            dateAdded: "2024-08-10",
            size: "5.2 MB",
            aiConfidence: "92%",
            tags: ["Engineering", "Station", "Design", "Specifications"],
            thumbnail: "fas fa-file-image",
            status: "archived",
            priority: "low"
        },
        {
            id: 5,
            title: "Operations Manual - Train Schedule",
            category: "operations",
            dateAdded: "2024-08-05",
            size: "1.5 MB",
            aiConfidence: "97%",
            tags: ["Operations", "Schedule", "Manual", "AI-Processed"],
            thumbnail: "fas fa-file-word",
            status: "active",
            priority: "medium"
        },
        {
            id: 6,
            title: "Contract Agreement - Maintenance Services",
            category: "contracts",
            dateAdded: "2024-07-30",
            size: "2.7 MB",
            aiConfidence: "95%",
            tags: ["Contract", "Maintenance", "Services", "Legal"],
            thumbnail: "fas fa-file-contract",
            status: "active",
            priority: "high"
        }
    ];
    
    displayDocuments(currentDocuments);
}

function displayDocuments(documents) {
    const grid = document.getElementById('document-grid');
    if (!grid) return;
    
    if (documents.length === 0) {
        grid.innerHTML = `
            <div class="no-documents">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--metro-light); margin-bottom: 1rem;"></i>
                <p>No documents found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    const documentsHTML = documents.map(doc => `
        <div class="document-card ${doc.priority ? 'priority-' + doc.priority : ''}" onclick="openDocument(${doc.id})">
            <div class="doc-thumbnail">
                <i class="${doc.thumbnail}"></i>
            </div>
            <div class="doc-info">
                <div class="doc-title">${doc.title}</div>
                <div class="doc-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(doc.dateAdded)}</span>
                    <span><i class="fas fa-hdd"></i> ${doc.size}</span>
                    <span><i class="fas fa-robot"></i> AI Confidence: ${doc.aiConfidence}</span>
                </div>
                <div class="doc-tags">
                    ${doc.tags.map(tag => 
                        `<span class="tag ${tag.includes('AI') ? 'ai-generated' : ''}">${tag}</span>`
                    ).join('')}
                </div>
                <div style="margin-top: 1rem;">
                    <span class="status-indicator status-${doc.status}">
                        <i class="fas fa-circle"></i>
                        ${doc.status.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
    
    grid.innerHTML = documentsHTML;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function openDocument(docId) {
    const doc = currentDocuments.find(d => d.id === docId);
    if (!doc) return;
    
    // Populate document viewer
    document.getElementById('doc-title').textContent = doc.title;
    document.getElementById('doc-category').textContent = doc.category.toUpperCase();
    document.getElementById('doc-date').textContent = formatDate(doc.dateAdded);
    document.getElementById('doc-size').textContent = doc.size;
    document.getElementById('doc-confidence').textContent = doc.aiConfidence;
    
    // Generate AI summary
    generateDocumentSummary(doc);
    
    // Display key topics
    displayKeyTopics(doc.tags);
    
    // Show modal
    document.getElementById('document-viewer').style.display = 'block';
}

function closeDocumentViewer() {
    document.getElementById('document-viewer').style.display = 'none';
}

async function generateDocumentSummary(doc) {
    const summaryElement = document.getElementById('summary-text');
    summaryElement.innerHTML = '<div class="ai-processing"><div class="loading"></div> AI is analyzing the document...</div>';
    
    try {
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Demo summaries based on document type
        const summaries = {
            'tenders': `This tender document outlines the requirements for ${doc.title}. Key specifications include technical requirements, timeline, and budget allocations. The document has been AI-verified for completeness and compliance with Kerala Metro standards.`,
            'safety': `Safety compliance report covering operational procedures and risk assessments. AI analysis indicates all safety protocols are documented and up-to-date. No critical issues identified.`,
            'finance': `Financial document detailing budget allocations and expenditure tracking. AI verification confirms all calculations are accurate and within approved limits.`,
            'engineering': `Technical engineering document with detailed specifications and design parameters. AI analysis confirms adherence to metro railway standards and building codes.`,
            'operations': `Operational procedures document covering day-to-day metro operations. AI review indicates comprehensive coverage of all operational scenarios.`,
            'contracts': `Legal contract document with terms and conditions. AI analysis confirms standard legal language and identifies key obligations and deadlines.`
        };
        
        summaryElement.textContent = summaries[doc.category] || 'AI-generated summary will appear here after processing.';
        
    } catch (error) {
        summaryElement.textContent = 'Error generating summary. Please try again.';
        console.error('Summary generation error:', error);
    }
}

function displayKeyTopics(tags) {
    const topicsContainer = document.getElementById('key-topics');
    const topicsHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    topicsContainer.innerHTML = topicsHTML;
}

// File upload functionality
function setupDragAndDrop() {
    const uploadZone = document.getElementById('upload-zone');
    if (!uploadZone) return;
    
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    uploadZone.addEventListener('click', () => {
        document.getElementById('file-input').click();
    });
}

function openUploadModal() {
    document.getElementById('upload-modal').style.display = 'block';
}

function closeUploadModal() {
    document.getElementById('upload-modal').style.display = 'none';
    resetUploadForm();
}

function handleFileSelect(e) {
    handleFiles(e.target.files);
}

async function handleFiles(files) {
    const fileArray = Array.from(files);
    
    // Validate files
    for (const file of fileArray) {
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            showNotification(`File ${file.name} is too large (max 10MB)`, 'error');
            return;
        }
        
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        if (!CONFIG.SUPPORTED_FORMATS.includes(fileExt)) {
            showNotification(`File type ${fileExt} is not supported`, 'error');
            return;
        }
    }
    
    // Process files
    for (let i = 0; i < fileArray.length; i++) {
        await processFile(fileArray[i], i + 1, fileArray.length);
    }
    
    showNotification(`Successfully uploaded ${fileArray.length} files`, 'success');
    setTimeout(() => {
        closeUploadModal();
        loadSampleDocuments(); // Refresh document list
    }, 1000);
}

async function processFile(file, current, total) {
    const progressElement = document.getElementById('upload-progress');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    progressElement.style.display = 'block';
    progressText.textContent = `Processing file ${current} of ${total}: ${file.name}`;
    
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
        progressFill.style.width = progress + '%';
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Simulate AI processing
    const autoClassify = document.getElementById('auto-classify').checked;
    const extractText = document.getElementById('extract-text').checked;
    const generateSummary = document.getElementById('generate-summary').checked;
    
    if (autoClassify) {
        progressText.textContent = 'AI is classifying document...';
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (extractText) {
        progressText.textContent = 'Extracting text with OCR...';
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    if (generateSummary) {
        progressText.textContent = 'Generating AI summary...';
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    progressFill.style.width = '100%';
    progressText.textContent = 'Upload complete!';
}

function resetUploadForm() {
    document.getElementById('file-input').value = '';
    document.getElementById('upload-progress').style.display = 'none';
    document.getElementById('progress-fill').style.width = '0%';
}

// Filter functionality
function filterDocuments() {
    const categoryFilter = document.getElementById('category-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    let filteredDocs = [...currentDocuments];
    
    if (categoryFilter) {
        filteredDocs = filteredDocs.filter(doc => doc.category === categoryFilter);
    }
    
    if (statusFilter) {
        filteredDocs = filteredDocs.filter(doc => doc.status === statusFilter);
    }
    
    if (dateFilter) {
        const now = new Date();
        filteredDocs = filteredDocs.filter(doc => {
            const docDate = new Date(doc.dateAdded);
            switch (dateFilter) {
                case 'today':
                    return docDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return docDate >= weekAgo;
                case 'month':
                    return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
                case 'year':
                    return docDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    }
    
    displayDocuments(filteredDocs);
}

// AI Tools functionality
async function smartDocumentScan() {
    showNotification('Starting AI document scan...', 'info');
    
    try {
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const results = {
            newDocuments: Math.floor(Math.random() * 10) + 1,
            duplicates: Math.floor(Math.random() * 5),
            missingMetadata: Math.floor(Math.random() * 8)
        };
        
        showNotification(`Scan complete: ${results.newDocuments} new docs, ${results.duplicates} duplicates found`, 'success');
        
    } catch (error) {
        showNotification('Document scan failed', 'error');
    }
}

async function runAutoClassification() {
    showNotification('Starting AI classification...', 'info');
    
    try {
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        const classified = Math.floor(Math.random() * 50) + 20;
        showNotification(`Successfully classified ${classified} documents`, 'success');
        
        // Update stats
        updateDashboardStats();
        
    } catch (error) {
        showNotification('Classification failed', 'error');
    }
}

async function generateReport() {
    showNotification('Generating AI report...', 'info');
    
    try {
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        showNotification('Report generated successfully', 'success');
        showSection('reports');
        
    } catch (error) {
        showNotification('Report generation failed', 'error');
    }
}

async function duplicateDetection() {
    showNotification('AI is scanning for duplicates...', 'info');
    
    try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const duplicates = Math.floor(Math.random() * 5) + 1;
        showNotification(`Found ${duplicates} potential duplicates`, 'warning');
        
    } catch (error) {
        showNotification('Duplicate detection failed', 'error');
    }
}

function openSummarizationTool() {
    showNotification('Opening document summarization tool...', 'info');
    // This would open a specific modal for document summarization
}

function openTranslationTool() {
    showNotification('Opening language translation tool...', 'info');
    // This would open a translation interface
}

async function runComplianceCheck() {
    showNotification('Running AI compliance check...', 'info');
    
    try {
        await new Promise(resolve => setTimeout(resolve, 3500));
        
        const compliance = {
            passed: Math.floor(Math.random() * 30) + 40,
            issues: Math.floor(Math.random() * 10) + 2
        };
        
        showNotification(`Compliance check complete: ${compliance.passed} docs passed, ${compliance.issues} issues found`, 'warning');
        
    } catch (error) {
        showNotification('Compliance check failed', 'error');
    }
}

function openOCRTool() {
    showNotification('Opening OCR text extraction tool...', 'info');
    // This would open OCR interface
}

async function findDuplicates() {
    showNotification('AI is analyzing documents for duplicates...', 'info');
    
    try {
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        const duplicates = Math.floor(Math.random() * 8) + 2;
        showNotification(`Found ${duplicates} potential duplicate sets`, 'warning');
        
    } catch (error) {
        showNotification('Duplicate detection failed', 'error');
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// AI API Integration (placeholder for real implementation)
class AIService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.openai.com/v1';
    }
    
    async classifyDocument(documentText) {
        // Placeholder for document classification
        const categories = ['tenders', 'contracts', 'safety', 'finance', 'engineering', 'operations'];
        return {
            category: categories[Math.floor(Math.random() * categories.length)],
            confidence: (Math.random() * 0.3 + 0.7).toFixed(2) // 70-100%
        };
    }
    
    async extractText(imageFile) {
        // Placeholder for OCR text extraction
        return "This would contain the extracted text from the document using OCR technology.";
    }
    
    async summarizeDocument(documentText) {
        // Placeholder for document summarization
        return "This is an AI-generated summary of the document highlighting key points and important information.";
    }
    
    async searchDocuments(query, documents) {
        // Placeholder for intelligent search
        return documents.filter(doc => 
            doc.title.toLowerCase().includes(query.toLowerCase()) ||
            doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
    }
    
    async detectDuplicates(documents) {
        // Placeholder for duplicate detection
        return [];
    }
    
    async checkCompliance(document) {
        // Placeholder for compliance checking
        return {
            compliant: Math.random() > 0.3,
            issues: [],
            recommendations: []
        };
    }
}

// Initialize AI service
const aiService = new AIService(CONFIG.AI_API_KEY);

// Export functions for global access
window.openAIChat = openAIChat;
window.closeAIChat = closeAIChat;
window.sendChatMessage = sendChatMessage;
window.openUploadModal = openUploadModal;
window.closeUploadModal = closeUploadModal;
window.openDocument = openDocument;
window.closeDocumentViewer = closeDocumentViewer;
window.performAISearch = performAISearch;
window.smartDocumentScan = smartDocumentScan;
window.runAutoClassification = runAutoClassification;
window.generateReport = generateReport;
window.duplicateDetection = duplicateDetection;
window.openSummarizationTool = openSummarizationTool;
window.openTranslationTool = openTranslationTool;
window.runComplianceCheck = runComplianceCheck;
window.openOCRTool = openOCRTool;
window.findDuplicates = findDuplicates;
window.selectSuggestion = selectSuggestion;
window.selectRole = selectRole;

// Role-based functionality
function selectRole(role) {
    currentUserRole = role;
    document.getElementById('role-selection-modal').style.display = 'none';
    
    // Hide all role dashboards
    document.querySelectorAll('.role-dashboard').forEach(dashboard => {
        dashboard.classList.remove('active');
    });
    
    // Show selected role dashboard
    const targetDashboard = document.getElementById(`dashboard-${role}`);
    if (targetDashboard) {
        targetDashboard.classList.add('active');
    }
    
    // Update navigation
    updateNavigationForRole(role);
    
    // Load role-specific data
    loadRoleSpecificData(role);
    
    // Update AI assistant context
    updateAIContext(role);
    
    showNotification(`Welcome to ${getRoleName(role)} dashboard`, 'success');
}

function getRoleName(role) {
    const roleNames = {
        'management': 'Executive Management',
        'controller': 'Train Controller',
        'engineer': 'Engineering',
        'finance': 'Finance Officer'
    };
    return roleNames[role] || 'User';
}

function updateNavigationForRole(role) {
    const nav = document.querySelector('.nav ul');
    
    // Update dashboard link to point to role-specific dashboard
    const dashboardLink = nav.querySelector('a[href="#dashboard"]');
    if (dashboardLink) {
        dashboardLink.setAttribute('href', `#dashboard-${role}`);
    }
    
    // Update user profile to show current role
    const userProfile = document.querySelector('.user-profile span');
    if (userProfile) {
        userProfile.textContent = getRoleName(role);
    }
}

function loadRoleSpecificData(role) {
    switch (role) {
        case 'management':
            loadExecutiveData();
            break;
        case 'controller':
            loadControllerData();
            break;
        case 'engineer':
            loadEngineerData();
            break;
        case 'finance':
            loadFinanceData();
            break;
    }
}

async function loadExecutiveData() {
    // Update KPIs with real-time data
    updateKPI('daily-ridership', kmrlData.ridership.daily.toLocaleString('en-IN'));
    updateKPI('revenue-today', `₹${kmrlData.revenue.today}L`);
    updateKPI('on-time-performance', `${kmrlData.operations.onTimePerformance}%`);
    updateKPI('safety-score', `${kmrlData.operations.safetyScore}%`);
    
    // Generate executive summaries
    generateExecutiveSummaries();
}

async function loadControllerData() {
    // Load real-time train data
    updateTrainStatus();
    
    // Generate operations AI summary
    generateOperationsSummary();
}

async function loadEngineerData() {
    // Load project status
    updateProjectStatus();
    
    // Generate technical AI summary
    generateTechnicalSummary();
}

async function loadFinanceData() {
    // Update financial KPIs
    updateFinancialKPIs();
    
    // Generate financial AI summary
    generateFinancialSummary();
}

function updateKPI(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// AI Summary Generation for Different Roles
async function generateExecutiveSummaries() {
    const summaries = {
        operations: "Today's operations are running smoothly with 98.2% on-time performance. Daily ridership of 1.24L passengers shows 5.2% growth. All safety protocols are maintained with 99.7% safety score. Phase 2 construction is 65% complete and on schedule.",
        financial: "Revenue performance is strong at ₹18.7L today, exceeding daily targets by 3.1%. Monthly revenue stands at ₹567.2Cr with 12% YoY growth. Operating expenses are within budget limits. 23 documents worth ₹8.5Cr pending approval.",
        alerts: "Track inspection scheduled for Line 1, Sector 3. Weather advisory for heavy rain expected. All critical systems operational. No safety incidents reported in last 24 hours.",
        strategy: "Recommend accelerating Phase 2 completion. Consider increasing train frequency during peak hours. Explore revenue optimization through dynamic pricing. Focus on improving customer satisfaction scores."
    };
    
    Object.keys(summaries).forEach(key => {
        const element = document.getElementById(`${key}-summary`);
        if (element) {
            typeWriterEffect(element, summaries[key]);
        }
    });
}

async function generateOperationsSummary() {
    const summary = "Current operations status: All trains running on schedule. KM-101 and KM-102 in active service. KM-103 under routine maintenance at depot. Weather conditions normal. Track inspection due for Sector 3. Passenger flow within normal parameters. All safety systems operational.";
    
    const element = document.getElementById('controller-ai-summary');
    if (element) {
        typeWriterEffect(element, summary);
    }
}

async function generateTechnicalSummary() {
    const summary = "Phase 2 extension project at 65% completion. Station upgrades ahead of schedule at 82%. Recent tender KM-2024-001 for track construction under review. All engineering specifications comply with IS 14713 standards. No critical technical issues identified.";
    
    const element = document.getElementById('engineer-ai-summary');
    if (element) {
        typeWriterEffect(element, summary);
    }
}

async function generateFinancialSummary() {
    const summary = "Financial health is robust with ₹45.2Cr monthly revenue showing 12% YoY growth. Operating expenses at ₹32.1Cr, slightly above budget. Pending approvals worth ₹8.5Cr require attention. Cash flow positive. Budget allocation for Phase 2 on track.";
    
    const element = document.getElementById('finance-ai-summary');
    if (element) {
        typeWriterEffect(element, summary);
    }
}

function updateTrainStatus() {
    // This would connect to real-time train tracking system
    // For demo, we're showing static data
    console.log('Train status updated for controller dashboard');
}

function updateProjectStatus() {
    // This would connect to project management system
    console.log('Project status updated for engineering dashboard');
}

function updateFinancialKPIs() {
    // This would connect to financial system
    console.log('Financial KPIs updated');
}

// Enhanced AI Assistant for Role-specific Context
function updateAIContext(role) {
    const roleContexts = {
        management: "You are an AI assistant for KMRL executive management. Focus on strategic insights, KPIs, financial performance, and high-level operational summaries.",
        controller: "You are an AI assistant for KMRL train controllers. Focus on real-time operations, train schedules, safety alerts, and operational procedures.",
        engineer: "You are an AI assistant for KMRL engineers. Focus on technical specifications, project updates, engineering standards, and construction progress.",
        finance: "You are an AI assistant for KMRL finance officers. Focus on financial reports, budget analysis, procurement documents, and cost management."
    };
    
    // Update chat history with role context
    chatHistory = [
        {
            type: 'ai',
            message: `Hello! I'm your KMRL AI assistant specialized for ${getRoleName(role)}. ${roleContexts[role]} How can I help you today?`
        }
    ];
}

function typeWriterEffect(element, text, speed = 50) {
    element.innerHTML = '';
    let i = 0;
    
    function typeChar() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeChar, speed);
        }
    }
    
    typeChar();
}

// Role-based AI Response Enhancement
async function getAIResponse(userMessage) {
    const roleSpecificResponses = {
        management: {
            keywords: ['revenue', 'ridership', 'performance', 'strategy', 'budget'],
            responses: {
                'revenue': "Current revenue performance shows strong growth at ₹18.7L today. Monthly revenue of ₹567.2Cr represents 12% YoY growth. I can provide detailed financial breakdowns or compare with previous periods.",
                'ridership': "Today's ridership of 1.24L passengers shows positive 5.2% growth vs yesterday. Peak hours showing increased utilization. Would you like me to analyze ridership patterns or forecast trends?",
                'performance': "Operational KPIs are strong: 98.2% on-time performance, 99.7% safety score. Phase 2 construction at 65% completion. All metrics trending positively against targets.",
                'default': "I can provide executive insights on operations, finance, strategic planning, and performance metrics. What specific area would you like me to analyze?"
            }
        },
        controller: {
            keywords: ['train', 'schedule', 'safety', 'operations', 'track'],
            responses: {
                'train': "Currently 3 trains operational: KM-101 (Aluva→Palarivattom), KM-102 (MG Road→Kaloor), KM-103 (Maintenance). All running on schedule with no delays reported.",
                'safety': "All safety systems operational. Track inspection due for Line 1, Sector 3. Weather advisory for heavy rain. No incidents in last 24 hours. Safety score maintained at 99.7%.",
                'operations': "Operations running smoothly with 98.2% on-time performance. Passenger flow normal. All stations operational. Emergency protocols ready. Would you like specific operational reports?",
                'default': "I can help with train schedules, safety protocols, operational procedures, and real-time monitoring. What do you need assistance with?"
            }
        },
        engineer: {
            keywords: ['project', 'construction', 'technical', 'design', 'specification'],
            responses: {
                'project': "Phase 2 extension at 65% completion, on schedule. Station upgrades at 82%, ahead of timeline. Tender KM-2024-001 for track construction under technical review.",
                'technical': "All engineering specs comply with IS 14713 metro standards. Recent design reviews completed for new stations. Technical documentation updated and AI-verified for compliance.",
                'construction': "Construction activities progressing well. Quality checks passed. Safety protocols maintained at all sites. Material procurement on schedule.",
                'default': "I can assist with technical specifications, project updates, engineering standards, and construction progress. What technical information do you need?"
            }
        },
        finance: {
            keywords: ['budget', 'cost', 'procurement', 'tender', 'financial'],
            responses: {
                'budget': "Current budget utilization: ₹32.1Cr operating expenses vs ₹45.2Cr revenue. Phase 2 budget allocation on track. Monthly variance within acceptable limits.",
                'procurement': "23 procurement documents worth ₹8.5Cr pending approval. Recent tenders processed and AI-verified for compliance with GFR 2017 guidelines.",
                'financial': "Financial health robust with 12% YoY revenue growth. Cash flow positive. All audit requirements met. CAG compliance maintained.",
                'default': "I can help with budget analysis, financial reports, procurement processes, and cost management. What financial information do you need?"
            }
        }
    };
    
    const roleData = roleSpecificResponses[currentUserRole];
    if (!roleData) {
        return "I can help you with KMRL document management and operations. What would you like to know?";
    }
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for role-specific keywords
    for (const keyword of roleData.keywords) {
        if (lowerMessage.includes(keyword)) {
            return roleData.responses[keyword] || roleData.responses.default;
        }
    }
    
    // Check for general help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return roleData.responses.default;
    }
    
    return roleData.responses.default;
}

// Load role-based summaries on initialization
async function loadRoleBasedSummaries() {
    // This would be called after role selection
    setTimeout(() => {
        if (currentUserRole === 'management') {
            generateExecutiveSummaries();
        }
    }, 1000);
}

// Add some helpful console messages
console.log('%c🚊 Kerala Metro Document Management System', 'color: #14A085; font-size: 16px; font-weight: bold;');
console.log('%c📁 AI-Powered Document Organization Ready', 'color: #1B365D; font-size: 14px;');
console.log('%c🤖 AI Features: Classification, OCR, Search, Compliance Check', 'color: #0D7377; font-size: 12px;');

// Service Worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}