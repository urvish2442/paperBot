export const GeneratePrintCSS = () => {
    return `
            * {
                box-sizing: border-box;
            }
            
            body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                line-height: 1.6;
                color: #333;
            }
            
            .question-paper-preview {
                width: 210mm !important;
                min-height: 297mm !important;
                margin: 0 auto !important;
                padding: 10mm !important;
                background-color: #ffffff !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
                border-radius: 8px !important;
                border: 1px solid #e0e0e0 !important;
            }
            
            @media print {
                .question-paper-preview {
                    width: 100% !important;
                    min-height: auto !important;
                    padding: 10mm !important;
                    box-shadow: none !important;
                    border: none !important;
                }
            }
            
            /* Custom paper header (stable class names) */
            .paper-header {
                text-align: center !important;
                margin-bottom: 4.5px !important;
                border-bottom: 2px solid #333 !important;
                padding-bottom: 4.5px !important;
            }
            .paper-header .trust-name {
                font-size: 14px !important;
                font-weight: 600 !important;
                margin-bottom: 4.5px !important;
                color: #1a1a1a !important;
            }
            .paper-header .school-name {
                font-size: 28px !important;
                font-weight: 800 !important;
                letter-spacing: 0.5px !important;
                color: #1a1a1a !important;
                margin-bottom: 4px !important;
                margin-top: 0 !important;
                line-height: 1.25 !important;
            }
            .paper-meta {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-top: 4px !important;
                gap: 16px !important;
            }
            .paper-meta .left, .paper-meta .right {
                font-weight: 700 !important;
                color: #333 !important;
                font-size: 16px !important;
            }
            .header-separator {
                border-bottom: 2px solid #333 !important;
                margin: 4px 0 0 0 !important;
            }
            .formatted-question p {
                margin: 0 !important;
            }
            .main-section {
                margin-bottom: 4px !important;
            }
            .type-block {
                margin-bottom: 9px !important;
            }
            /* Stable classes for question rows (works in print window) */
            .qp-question-row {
                display: flex !important;
                justify-content: space-between !important;
                align-items: flex-start !important;
                margin-bottom: 0px !important;
            }
            .qp-qno {
                font-weight: bold !important;
                font-size: 16px !important;
                color: #1a1a1a !important;
                min-width: 25px !important;
                margin-right: 8px !important;
            }
            .qp-qtext {
                flex: 1 !important;
                font-size: 15px !important;
                line-height: 1.6 !important;
                color: #333 !important;
                text-align: justify !important;
            }
            .qp-qtext p { 
                margin: 0 !important;
                padding: 0 !important;
                text-align: justify !important;
            }
            .qp-qmarks {
                font-weight: bold !important;
                font-size: 14px !important;
                color: #666 !important;
                margin-left: 8px !important;
                min-width: 40px !important;
                text-align: right !important;
                white-space: nowrap !important;
            }
            
            /* Header Styles */
            .css-gk1sko {
                text-align: center !important;
                margin-bottom: 30px !important;
                border-bottom: 2px solid #333 !important;
                padding-bottom: 20px !important;
            }
            
            /* Header Title */
            .css-1x32eg9-MuiTypography-root {
                font-size: 28px !important;
                font-weight: bold !important;
                margin-bottom: 10px !important;
                color: #1a1a1a !important;
            }
            
            /* Time and Marks Container */
            .css-n9btsa {
                display: flex !important;
                justify-content: center !important;
                gap: 32px !important;
                margin-top: 16px !important;
            }
            
            /* Time and Marks Text */
            .css-1jiljnr-MuiTypography-root {
                font-weight: bold !important;
                color: #333 !important;
                font-size: 16px !important;
            }
            
            /* Instructions Box */
            .css-tkplri {
                margin-bottom: 30px !important;
                padding: 24px !important;
                background: #f8f9fa !important;
                border-radius: 4px !important;
                border: 1px solid #dee2e6 !important;
            }
            
            /* Instructions Title */
            .css-15qf0oe-MuiTypography-root {
                font-weight: bold !important;
                margin-bottom: 16px !important;
                color: #495057 !important;
                font-size: 18px !important;
            }
            
            /* Instructions List */
            .css-1ygbl0l-MuiList-root {
                padding: 0 !important;
            }
            
            .css-f89oon-MuiListItem-root {
                padding: 4px 0 !important;
            }
            
            .css-13wq8fk-MuiTypography-root {
                font-size: 14px !important;
                color: #495057 !important;
                line-height: 1.5 !important;
            }
            
            /* Section Container */
            .css-olj9g3 {
                margin-bottom: 40px !important;
                page-break-inside: avoid !important;
            }
            
            /* Section Headers */
            .css-1jcowt9-MuiTypography-root {
                margin-bottom: 20px !important;
                font-weight: bold !important;
                font-size: 20px !important;
                color: #1a1a1a !important;
                border-bottom: 2px solid #333 !important;
                padding-bottom: 8px !important;
            }
            
            /* Questions Container */
            .css-1h1tnhe {
                padding-left: 16px !important;
            }
            
            /* Individual Question Container */
            .css-jx397n {
                margin-bottom: 24px !important;
                padding: 0 !important;
                border: none !important;
                background-color: transparent !important;
            }
            
            /* Question Layout */
            .css-avjk9y {
                display: flex !important;
                justify-content: space-between !important;
                align-items: flex-start !important;
                margin-bottom: 16px !important;
            }
            
            /* Question Number */
            .css-1h7hkij-MuiTypography-root {
                font-weight: bold !important;
                font-size: 16px !important;
                color: #1a1a1a !important;
                min-width: 60px !important;
            }
            
            /* Question Text */
            .css-12193vx-MuiTypography-root {
                flex: 1 !important;
                font-size: 15px !important;
                line-height: 1.6 !important;
                color: #333 !important;
            }
            
            /* Question Text Paragraph */
            .css-12193vx-MuiTypography-root p {
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* Marks Display */
            .css-123rhdl-MuiTypography-root {
                font-weight: bold !important;
                font-size: 14px !important;
                color: #666 !important;
                margin-left: 16px !important;
                min-width: 40px !important;
                text-align: right !important;
            }
            
            /* Print Specific Styles */
            @media print {
                body { 
                    margin: 0 !important; 
                    padding: 20px !important;
                }
                .no-print { 
                    display: none !important; 
                }
                .css-jx397n { 
                    page-break-inside: avoid !important; 
                }
                .css-olj9g3 { 
                    page-break-inside: avoid !important; 
                }
            }
        `;
};
