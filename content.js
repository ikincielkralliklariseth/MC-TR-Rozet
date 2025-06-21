(function () {
  const username = document.querySelector('.p-navgroup-linkText')?.textContent?.trim();
  if (!username) {
    console.error("Kullanıcı adı bulunamadı!");
    return alert("Kullanıcı adı bulunamadı!");
  }

  let savedBadges;
  try {
    savedBadges = JSON.parse(localStorage.getItem('mc-tr-badges') || '{}');
  } catch (e) {
    console.error('savedBadges JSON parse hatası:', e);
    savedBadges = {};
    localStorage.setItem('mc-tr-badges', '{}');
  }

  let customRozetler = [];
  try {
    localStorage.setItem('mc-tr-custom-roles', '[]'); // localStorage'daki özel rolleri sıfırla
  } catch (e) {
    console.error('localStorage custom roles sıfırlama hatası:', e);
    alert("Özel roller sıfırlanamadı, tarayıcı depolama hatası!");
  }

  let rozetler = [
    {
      name: "Site Sahibi",
      id: "sitesahibi",
      priority: 1,
      html: `<div class="userBanner yoneticiBanner sitesahibi message-userBanner custom-badge" itemprop="jobTitle" data-badge="sitesahibi"><span class="userBanner-before"></span><strong><i class="fas fa-hammer"></i> Site Sahibi</strong><span class="userBanner-after"></span></div>`
    },
    {
      name: "Genel Sorumlu",
      id: "genelsorumlu",
      priority: 2,
      html: `<div class="userBanner yetkiliBanner genelsorumlu message-userBanner custom-badge" itemprop="jobTitle" data-badge="genelsorumlu"><span class="userBanner-before"></span><strong><i class="fas fa-users-crown"></i> Genel Sorumlu</strong><span class="userBanner-after"></span></div>`
    },
    {
      name: "Yönetici",
      id: "yonetici",
      priority: 3,
      html: `<div class="userBanner yoneticiBanner yonetici lines line message-userBanner custom-badge" itemprop="jobTitle" data-badge="yonetici"><span class="userBanner-before"></span><strong><i class="fa--xf fa-brands fa-black-tie" aria-hidden="true"></i> Yönetici</strong><span class="userBanner-after"></span></div>`
    },
    {
      name: "Seçkin Moderatör",
      id: "seckinmoderator",
      priority: 4,
      html: `<div class="userBanner modBanner seckin message-userBanner custom-badge" itemprop="jobTitle" data-badge="seckinmoderator"><span class="userBanner-before"></span><strong><i class="fas fa-atlas"></i> Seçkin Moderatör</strong><span class="userBanner-after"></span></div>`
    },
    {
      name: "Yıldız Moderatör",
      id: "yildizmoderator",
      priority: 5,
      html: `<div class="userBanner haftaninBanner yildizmoderator message-userBanner custom-badge" itemprop="jobTitle" data-badge="yildizmoderator"><span class="userBanner-before"></span><strong><i class="fas fa-star"></i> Yıldız Moderatör</strong><span class="userBanner-after"></span></div>`
    },
    {
      name: "Yıldız Destek",
      id: "yildizdestek",
      priority: 6,
      html: `<div class="userBanner haftaninBanner destekadami message-userBanner custom-badge" itemprop="jobTitle" data-badge="yildizdestek"><span class="userBanner-before"></span><strong><i class="fas fa-star"></i> Yıldız Destek</strong><span class="userBanner-after"></span></div>`
    },
    {
      name: "Deneyimli Destek",
      id: "deneyimlidestek",
      priority: 7,
      html: `<div class="userBanner destekBanner deneyimli message-userBanner custom-badge" itemprop="jobTitle" data-badge="deneyimlidestek"><span class="userBanner-before"></span><strong><i class="fas fa-code"></i> Deneyimli Destek</strong><span class="userBanner-after"></span></div>`
    },
    {
      name: "Stajyer",
      id: "stajyer",
      priority: 8,
      html: `<div class="userBanner destekBanner stajyer message-userBanner custom-badge" itemprop="jobTitle" data-badge="stajyer"><span class="userBanner-before"></span><strong>Stajyer</strong><span class="userBanner-after"></span></div>`
    },
    {
      name: "Hosting Görevlisi",
      id: "hostinggorevli",
      priority: 9,
      html: `<div class="userBanner uyeBanner hostinggorevli message-userBanner custom-badge" itemprop="jobTitle" data-badge="hostinggorevli"><span class="userBanner-before"></span><strong><i class="fad fa-user-plus"></i> Hosting Görevlisi</strong><span class="userBanner-after"></span></div>`
    },
    {
      name: "Sunucu Sahibi",
      id: "sunucusahibi",
      priority: 10,
      html: `<div class="userBanner uyeBanner sunucusahibi message-userBanner custom-badge" itemprop="jobTitle" data-badge="sunucusahibi"><span class="userBanner-before"></span><strong><i class="fas fa-laptop-code"></i> Sunucu Sahibi</strong><span class="userBanner-after"></span></div>`
    },
    {
      name: "Onaylı Satıcı",
      id: "onaylisatici",
      priority: 11,
      html: `<div class="userBanner uyeBanner onaylisatici message-userBanner custom-badge" itemprop="jobTitle" data-badge="onaylisatici"><span class="userBanner-before"></span><strong><i class="fas fa-shopping-basket"></i> Onaylı Satıcı</strong><span class="userBanner-after"></span></div>`
    },
    {
      name: "Premium",
      id: "premium",
      priority: 12,
      html: `<div class="userBanner uyeBanner premium message-userBanner custom-badge" itemprop="jobTitle" data-badge="premium"><span class="userBanner-before"></span><strong><i class="fas fa-heart"></i> Premium</strong><span class="userBanner-after"></span></div>`
    },
    {
      name: "MinePass",
      id: "minepass",
      priority: 13,
      html: `<div class="userBanner uyeBanner minepass message-userBanner custom-badge" itemprop="jobTitle" data-badge="minepass"><span class="userBanner-before"></span><strong><i class="far fa-cubes"></i> MinePass</strong><span class="userBanner-after"></span></div>`
    }
  ];

  rozetler = rozetler.concat(customRozetler);
  function generateUniqueId() {
    return 'custom-' + Math.random().toString(36).substr(2, 9);
  }

  function validateRoleHtml(html) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const div = doc.body.querySelector('div.userBanner');
      const valid = div && div.querySelector('span.userBanner-before') && div.querySelector('strong') && div.querySelector('span.userBanner-after');
      if (!valid) {
        console.log('HTML doğrulama hatası:', { html, div });
      }
      return valid;
    } catch (e) {
      console.error('HTML parse hatası:', e);
      return false;
    }
  }

  function addCustomRole(html) {
    console.log('addCustomRole çağrıldı:', html);
    if (!validateRoleHtml(html)) {
      alert("Geçersiz HTML! Lütfen doğru userBanner formatını kullanın. Örnek: <div class='userBanner uyeBanner customRole message-userBanner'><span class='userBanner-before'></span><strong>CustomRole</strong><span class='userBanner-after'></span></div>");
      console.log('Geçersiz HTML, rol eklenmedi.');
      return false;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const strong = doc.body.querySelector('strong');
      const name = strong.textContent.trim();
      const id = generateUniqueId();

      const newRole = {
        name: name,
        id: id,
        priority: -1, // Özel roller her zaman en altta
        html: html.replace('message-userBanner', 'message-userBanner custom-badge').replace(/data-badge="[^"]*"/, `data-badge="${id}"`),
        isCustom: true
      };

      customRozetler.push(newRole);
      rozetler.push(newRole);
      localStorage.setItem('mc-tr-custom-roles', JSON.stringify(customRozetler));
      console.log('Yeni rol kaydedildi:', newRole);
      return true;
    } catch (e) {
      console.error('addCustomRole hatası:', e);
      alert("Rol eklenemedi, bir hata oluştu!");
      return false;
    }
  }

  if (!document.getElementById('rozet-style')) {
    const style = document.createElement("style");
    style.id = 'rozet-style';
    style.innerHTML = `
      /* Floating Button */
      #rozet-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 24px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        backdrop-filter: blur(10px);
      }
      
      #rozet-btn:hover {
        transform: scale(1.1) rotate(10deg);
        box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
      }
      
      #rozet-btn:active {
        transform: scale(0.95);
      }

      /* Menu Container */
      #rozet-menu {
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        padding: 20px;
        display: none;
        flex-direction: column;
        gap: 12px;
        z-index: 9999;
        min-width: 280px;
        max-height: 500px;
        overflow-y: auto;
        animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      #rozet-menu::-webkit-scrollbar {
        width: 6px;
      }

      #rozet-menu::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }

      #rozet-menu::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 10px;
      }

      #rozet-menu h4 {
        margin: 0 0 15px 0;
        font-size: 18px;
        font-weight: 600;
        color: #333;
        text-align: center;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Badge Options */
      .rozet-option {
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.7);
        border: 2px solid transparent;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(10px);
      }

      .rozet-option::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.5s;
      }

      .rozet-option:hover::before {
        left: 100%;
      }

      .rozet-option:hover {
        background: rgba(102, 126, 234, 0.1);
        border-color: rgba(102, 126, 234, 0.3);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
      }

      .rozet-option:active {
        transform: translateY(0);
        background: rgba(102, 126, 234, 0.2);
      }

      .rozet-option.success {
        background: rgba(46, 213, 115, 0.2) !important;
        border-color: rgba(46, 213, 115, 0.5) !important;
      }

      .rozet-option.error {
        background: rgba(255, 107, 107, 0.2) !important;
        border-color: rgba(255, 107, 107, 0.5) !important;
      }

      /* User Management Section */
      #user-management {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        margin-top: 15px;
        padding-top: 15px;
      }

      #user-management h5 {
        margin: 0 0 10px 0;
        font-size: 14px;
        color: #666;
        text-align: center;
      }

      .user-badge-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        margin-bottom: 8px;
        font-size: 12px;
      }

      .remove-badge {
        background: #ff4757;
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s ease;
      }

      .remove-badge:hover {
        background: #ff3742;
        transform: scale(1.1);
      }

      .clear-all-btn {
        background: linear-gradient(135deg, #ff4757, #ff3742);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.3s ease;
        width: 100%;
      }

      .clear-all-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
      }

      /* Role Add Section */
      #role-add-section {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        margin-top: 15px;
        padding-top: 15px;
      }

      #role-add-section h5 {
        margin: 0 0 10px 0;
        font-size: 14px;
        color: #666;
        text-align: center;
      }

      #role-html-input {
        width: 100%;
        min-height: 80px;
        padding: 10px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        resize: vertical;
        font-family: monospace;
        font-size: 12px;
      }

      #add-role-btn {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.3s ease;
        width: 100%;
        margin-top: 10px;
      }

      #add-role-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }

      /* Animations */
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* Custom badge styling */
      .custom-badge {
        margin: 2px 0;
        animation: fadeIn 0.5s ease;
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        #rozet-menu {
          background: rgba(30, 30, 30, 0.95);
          border-color: rgba(255, 255, 255, 0.1);
        }
        
        #rozet-menu h4 {
          color: #fff;
        }
        
        .rozet-option {
          background: rgba(50, 50, 50, 0.7);
          color: #fff;
        }
        
        .rozet-option:hover {
          background: rgba(102, 126, 234, 0.2);
        }
        
        .user-badge-item {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        #role-html-input {
          background: rgba(50, 50, 50, 0.7);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.2);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getUserBadgesSorted(userBadgeIds) {
    if (!Array.isArray(userBadgeIds)) return [];
    
    return userBadgeIds
      .map(badgeId => rozetler.find(r => r.id === badgeId))
      .filter(badge => badge)
      .sort((a, b) => {
        // Varsayılan rozetler önce, özel rozetler sonra
        if (!a.isCustom && b.isCustom) return -1;
        if (a.isCustom && !b.isCustom) return 1;
        // Varsayılan rozetler kendi içinde önceliğe göre (15 > 2)
        // Özel rozetler eklenme sırasına göre (priority hep -1)
        return b.priority - a.priority; // Yüksek öncelik üstte
      });
  }

  function loadSavedBadges() {
    Object.keys(savedBadges).forEach(user => {
      const userBadgeIds = savedBadges[user];
      if (!Array.isArray(userBadgeIds)) return;

      document.querySelectorAll('.message-user').forEach(userBox => {
        const nameEl = userBox.querySelector('.username');
        if (nameEl && nameEl.textContent.trim() === user) {
          userBox.querySelectorAll('.custom-badge').forEach(badge => badge.remove());
          
          const sortedBadges = getUserBadgesSorted(userBadgeIds);
          
          const target = userBox.querySelector('.message-userTitle') ||
                         userBox.querySelector('.message-name');
          
          if (target && sortedBadges.length > 0) {
            sortedBadges.forEach(badge => {
              const temp = document.createElement('div');
              temp.innerHTML = badge.html;
              const badgeElement = temp.firstChild;
              target.insertAdjacentElement('afterend', badgeElement);
            });
          }
        }
      });
    });
  }

  function saveBadge(username, badgeId) {
    if (!savedBadges[username]) {
      savedBadges[username] = [];
    }
    
    if (!Array.isArray(savedBadges[username])) {
      savedBadges[username] = [];
    }
    
    if (savedBadges[username].includes(badgeId)) {
      return false;
    }
    
    savedBadges[username].push(badgeId);
    try {
      localStorage.setItem('mc-tr-badges', JSON.stringify(savedBadges));
      console.log('Rozet kaydedildi:', { username, badgeId });
      return true;
    } catch (e) {
      console.error('localStorage kaydetme hatası (badges):', e);
      alert("Rozet kaydedilemedi, tarayıcı depolama hatası!");
      return false;
    }
  }

  function removeBadge(username, badgeId) {
    if (savedBadges[username] && Array.isArray(savedBadges[username])) {
      savedBadges[username] = savedBadges[username].filter(id => id !== badgeId);
      if (savedBadges[username].length === 0) {
        delete savedBadges[username];
      }
      try {
        localStorage.setItem('mc-tr-badges', JSON.stringify(savedBadges));
        console.log('Rozet kaldırıldı:', { username, badgeId });
      } catch (e) {
        console.error('localStorage kaydetme hatası (remove):', e);
        alert("Rozet kaldırılamadı, tarayıcı depolama hatası!");
      }
    }
  }

  function clearAllBadges(username) {
    delete savedBadges[username];
    try {
      localStorage.setItem('mc-tr-badges', JSON.stringify(savedBadges));
      console.log('Tüm rozetler temizlendi:', username);
    } catch (e) {
      console.error('localStorage kaydetme hatası (clear):', e);
      alert("Rozetler temizlenemedi, tarayıcı depolama hatası!");
    }
  }

  function updateUserBadgeStatus() {
    const userBadgeIds = savedBadges[username] || [];
    
    const badgeList = document.querySelector('.badge-list');
    if (badgeList) {
      badgeList.innerHTML = '';
      
      if (userBadgeIds.length > 0) {
        const sortedBadges = getUserBadgesSorted(userBadgeIds);
        
        sortedBadges.forEach(badge => {
          const item = document.createElement('div');
          item.className = 'user-badge-item';
          item.innerHTML = `
            <span><strong>#${badge.priority}</strong> ${badge.name}</span>
            <button class="remove-badge" data-badge-id="${badge.id}">×</button>
          `;
          badgeList.appendChild(item);
        });
        
        badgeList.querySelectorAll('.remove-badge').forEach(btn => {
          btn.addEventListener('click', function() {
            const badgeId = this.getAttribute('data-badge-id');
            removeBadge(username, badgeId);
            loadSavedBadges();
            updateUserBadgeStatus();
          });
        });
      } else {
        badgeList.innerHTML = '<div style="text-align: center; color: #999; font-size: 12px;">Henüz rozet eklenmedi.</div>';
      }
    }
  }

  function updateBadgeOptions() {
    const badgeOptionsDiv = document.querySelector('.badge-options');
    if (badgeOptionsDiv) {
      badgeOptionsDiv.innerHTML = '';
      
      const sortedRozetler = [...rozetler].sort((a, b) => {
        // Varsayılan rozetler önce, özel rozetler sonra
        if (!a.isCustom && b.isCustom) return -1;
        if (a.isCustom && !b.isCustom) return 1;
        // Varsayılan rozetler kendi içinde önceliğe göre (15 > 2)
        // Özel rozetler eklenme sırasına göre (priority hep -1)
        return b.priority - a.priority; // Yüksek öncelik üstte
      });
      
      sortedRozetler.forEach(r => {
        const opt = document.createElement("div");
        opt.className = "rozet-option";
        opt.innerHTML = `<i class="fas fa-award"></i> <strong>#${r.priority}</strong> ${r.name}`;
        opt.addEventListener('click', function() {
          const added = saveBadge(username, r.id);
          if (added) {
            loadSavedBadges();
            updateUserBadgeStatus();
            
            this.classList.add('success');
            setTimeout(() => {
              this.classList.remove('success');
            }, 1000);
          } else {
            this.classList.add('error');
            setTimeout(() => {
              this.classList.remove('error');
            }, 1000);
          }
        });
        badgeOptionsDiv.appendChild(opt);
      });
    }
  }

  if (!document.getElementById('rozet-btn')) {
    const btn = document.createElement("button");
    btn.id = "rozet-btn";
    btn.innerHTML = "🏅";
    btn.title = "Rozet Menüsü";
    document.body.appendChild(btn);

    const menu = document.createElement("div");
    menu.id = "rozet-menu";
    menu.innerHTML = `
      <h4>🏆 Rozet Seç, ${username}!</h4>
      <div class="badge-options"></div>
      <div id="user-management">
        <h5>📋 Mevcut Rozetlerin</h5>
        <div class="badge-list"></div>
        <button class="clear-all-btn">🗑️ Tümünü Temizle</button>
      </div>
      <div id="role-add-section">
        <h5>➕ Rol Ekle</h5>
        <textarea id="role-html-input" placeholder="Örnek: <div class='userBanner uyeBanner customRole message-userBanner'><span class='userBanner-before'></span><strong>CustomRole</strong><span class='userBanner-after'></span></div>"></textarea>
        <button id="add-role-btn">Rolü Ekle</button>
      </div>
    `;
    document.body.appendChild(menu);

    const addRoleBtn = menu.querySelector('#add-role-btn');
    const roleHtmlInput = menu.querySelector('#role-html-input');
    if (addRoleBtn && roleHtmlInput) {
      addRoleBtn.addEventListener('click', function() {
        const html = roleHtmlInput.value.trim();
        console.log('Rol ekle butonuna basıldı:', html);
        if (!html) {
          alert("Lütfen bir HTML kodu girin!");
          console.log('HTML boş, rol eklenmedi.');
          return;
        }
        if (addCustomRole(html)) {
          updateBadgeOptions();
          loadSavedBadges();
          updateUserBadgeStatus();
          roleHtmlInput.value = '';
          alert("Rol başarıyla eklendi!");
        }
      });
    } else {
    }

    updateBadgeOptions();

    const clearAllBtn = menu.querySelector('.clear-all-btn');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', function() {
        clearAllBadges(username);
        loadSavedBadges();
        updateUserBadgeStatus();
      });
    }

    let isOpen = false;
    btn.addEventListener('click', function() {
      isOpen = !isOpen;
      menu.style.display = isOpen ? "flex" : "none";
      if (isOpen) {
        updateUserBadgeStatus();
        updateBadgeOptions();
      }
    });

    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target) && isOpen) {
        isOpen = false;
        menu.style.display = "none";
      }
    });
  }
  loadSavedBadges();

  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1 && (node.classList.contains('message-user') || node.querySelector('.message-user'))) {
          setTimeout(loadSavedBadges, 100);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();