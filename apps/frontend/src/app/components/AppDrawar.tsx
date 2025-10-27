.carousel-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  animation: fadeInUp 0.8s ease 0.3s backwards;
}

.carousel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.carousel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #667eea;
  font-size: 1.8rem;
  font-weight: 600;
}

.carousel-controls {
  display: flex;
  gap: 10px;
}

.carousel-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1f3f4;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.carousel-btn:hover {
  background: #e8eaed;
  transform: scale(1.1);
}

.carousel-btn:active {
  transform: scale(0.95);
}

.carousel-wrapper {
  position: relative;
  overflow: hidden;
}

.carousel-container {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 10px 0;
}

.carousel-container::-webkit-scrollbar {
  display: none;
}

.carousel-card {
  min-width: 320px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.carousel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  border-color: #667eea;
}

.card-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ff4444;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

.card-badge.news {
  background: #2196F3;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.card-icon {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.card-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.85rem;
  color: #999;
}

.card-meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  animation: fadeInDown 0.8s ease;
}

header h1 {
  font-size: 3.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

header p {
  font-size: 1.2rem;
  opacity: 0.95;
}

.overview {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  animation: fadeInUp 0.8s ease 0.2s backwards;
}

.section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  animation: fadeInUp 0.8s ease 0.4s backwards;
}

.section h2 {
  color: #667eea;
  margin-bottom: 20px;
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.app-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 25px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.app-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  border-color: #667eea;
}

.app-card h3 {
  color: #667eea;
  font-size: 1.5rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-card ul {
  list-style: none;
  padding-left: 0;
}

.app-card li {
  padding: 8px 0;
  color: #555;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.app-card li:hover {
  padding-left: 10px;
  color: #667eea;
}

.app-card li:last-child {
  border-bottom: none;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.benefit-item {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  padding: 20px;
  border-radius: 10px;
  font-weight: 600;
  color: #333;
  transition: all 0.3s ease;
}

.benefit-item:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.status-badge {
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 10px;
}

.status-complete {
  background: #4caf50;
  color: white;
}

.status-progress {
  background: #ff9800;
  color: white;
}

.status-pending {
  background: #9e9e9e;
  color: white;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  margin: 15px 0;
  line-height: 1.6;
}

.route-list {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-top: 15px;
}

.route-item {
  padding: 10px;
  margin: 5px 0;
  background: white;
  border-left: 4px solid #667eea;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.route-item:hover {
  padding-left: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.timeline {
  position: relative;
  padding-left: 40px;
  margin-top: 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -33px;
  top: 20px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: white;
  border: 3px solid #667eea;
}

footer {
  text-align: center;
  color: white;
  padding: 30px;
  margin-top: 40px;
  font-size: 0.9rem;
  opacity: 0.9;
}

@keyframes fadeInDown {
  from {
      opacity: 0;
      transform: translateY(-30px);
  }
  to {
      opacity: 1;
      transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
      opacity: 0;
      transform: translateY(30px);
  }
  to {
      opacity: 1;
      transform: translateY(0);
  }
}

@media (max-width: 768px) {
  header h1 {
      font-size: 2.5rem;
  }

  .apps-grid {
      grid-template-columns: 1fr;
  }
}
</style>
</head>
<body>
<!-- 