document.addEventListener("DOMContentLoaded", function() {
    const footerHTML = `
    <style>
        .site-footer {
            border-top: 1px solid var(--border);
            margin-top: 60px;
            padding: 40px 0;
            background: #fff;
        }
        .footer-content {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }
        .footer-brand {
            font-weight: 700;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-dark);
            text-decoration: none;
        }
        .footer-links {
            display: flex;
            gap: 25px;
        }
        .footer-links a {
            color: var(--text-med);
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--primary); }
        .footer-copy {
            font-size: 0.85rem;
            color: var(--text-light);
        }
        @media (max-width: 768px) {
            .footer-content { flex-direction: column; text-align: center; }
            .footer-links { flex-direction: column; gap: 10px; }
        }
    </style>

    <footer class="site-footer">
        <div class="footer-content">
            <a href="index.html" class="footer-brand">
                <i class="ph-fill ph-flame" style="color:var(--primary);"></i>
                LevorLabs
            </a>
            
            <div class="footer-links">
				<a href="https://www.levorlabs.com/">Our Other Calculators</a>

				<a href="https://www.levorlabs.com/contact.html">Contact</a>
            </div>

            <div class="footer-copy">
                &copy; ${new Date().getFullYear()} LevorLabs
            </div>
        </div>
    </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
});