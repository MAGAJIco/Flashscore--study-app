 {
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 0 20px;
            position: sticky;
            top: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 64px;
        }

        .navbar-left {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .menu-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .menu-icon:hover {
            background: #f1f3f4;
        }

        .hamburger {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .hamburger span {
            width: 20px;
            height: 2px;
            background: #5f6368;
            border-radius: 2px;
            transition: all 0.3s ease;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 600;
            color: #667eea;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .navbar-right {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .nav-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 1.2rem;
        }

        .nav-icon:hover {
            background: #f1f3f4;
        }

        .app-drawer-btn {
            position: relative;
        }

        /* Google-style App Drawer */
        .app-drawer-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1998;
        }

        .app-drawer-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .app-drawer {
            position: fixed;
            top: 70px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            padding: 20px;
            width: 380px;
            max-height: 480px;
            overflow-y: auto;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            z-index: 1999;
        }

        .app-drawer.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .app-drawer-header {
            font-size: 1.1rem;
            font-weight: 600;
            color: #5f6368;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e8eaed;
        }

        .app-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }

        .app-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 15px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            color: #5f6368;
        }

        .app-item:hover {
            background: #f1f3f4;
        }

        .app-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 8px;
            color: white;
        }

        .app-name {
            font-size: 0.85rem;
            text-align: center;
            font-weight: 500;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        