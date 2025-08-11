
(function(){
  function setText(el, val){
    if(!el) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.value = val; return; }
    el.textContent = val;
  }
  function setImage(el, src){
    if(!el) return;
    if (el.tagName === 'IMG') el.src = src;
    else el.style.backgroundImage = 'url("'+src+'")';
  }
  function ensureMeta(name, content){
    var m = document.querySelector('meta[name="'+name+'"]');
    if(!m){
      m = document.createElement('meta');
      m.setAttribute('name', name);
      document.head.appendChild(m);
    }
    m.setAttribute('content', content);
  }
  function ensureOg(property, content){
    var m = document.querySelector('meta[property="'+property+'"]');
    if(!m){
      m = document.createElement('meta');
      m.setAttribute('property', property);
      document.head.appendChild(m);
    }
    m.setAttribute('content', content);
  }

  fetch('/content/content.json', { cache: 'no-store' })
    .then(function(r){ return r.json(); })
    .then(function(data){
      try {
        if (data.seo_title) document.title = data.seo_title;
        if (data.seo_description) ensureMeta('description', data.seo_description);
        if (data.og_image) ensureOg('og:image', data.og_image);

        document.querySelectorAll('[data-cms]').forEach(function(el){
          var path = el.getAttribute('data-cms');
          var parts = path.split('.');
          var val = parts.reduce(function(acc, k){ return (acc && typeof acc === 'object') ? acc[k] : undefined; }, data);
          if (val == null) return;
          if (el.tagName === 'IMG' || el.hasAttribute('data-cms-image')) setImage(el, val);
          else setText(el, val);
        });

        var idsMap = {
          heroTitle: data.hero && data.hero.title,
          heroSubtitle: data.hero && data.hero.subtitle,
          aboutHeading: data.about && data.about.heading,
          aboutBody: data.about && data.about.body,
          hoursText: data.hours && data.hours.text,
          addressText: data.contact && data.contact.address,
          phonePrimary: data.contact && data.contact.phone1,
          phoneSecondary: data.contact && data.contact.phone2,
        };
        Object.keys(idsMap).forEach(function(id){
          var el = document.getElementById(id);
          if(!el || idsMap[id]==null) return;
          setText(el, idsMap[id]);
        });

        var imgMap = {
          heroImage: data.hero && data.hero.image,
          aboutImage: data.about && data.about.image
        };
        Object.keys(imgMap).forEach(function(id){
          var el = document.getElementById(id);
          if(!el || imgMap[id]==null) return;
          setImage(el, imgMap[id]);
        });

        var menuContainer = document.getElementById('menuContainer');
        if (menuContainer && Array.isArray(data.menu)) {
          menuContainer.innerHTML = '';
          data.menu.forEach(function(section){
            var s = document.createElement('section');
            var h = document.createElement('h3'); h.textContent = section.title || '';
            var p = document.createElement('p'); p.textContent = section.description || '';
            s.appendChild(h); if(section.description) s.appendChild(p);
            if (Array.isArray(section.items) && section.items.length) {
              var ul = document.createElement('ul');
              section.items.forEach(function(item){
                var li = document.createElement('li');
                var nm = item.name || '';
                var note = item.note ? ' — '+item.note : '';
                var price = item.price ? ' • '+item.price : '';
                li.textContent = nm + note + price;
                ul.appendChild(li);
              });
              s.appendChild(ul);
            }
            menuContainer.appendChild(s);
          });
        }

        var galleryGrid = document.getElementById('galleryGrid');
        if (galleryGrid && Array.isArray(data.gallery)) {
          galleryGrid.innerHTML = '';
          data.gallery.forEach(function(src){
            var img = document.createElement('img');
            img.alt = 'Haritam gallery';
            img.loading = 'lazy';
            img.src = src;
            galleryGrid.appendChild(img);
          });
        }

        var insta = document.querySelector('[data-cms-link="instagram"]');
        if (insta && data.contact && data.contact.instagram) {
          insta.setAttribute('href', data.contact.instagram);
        }
        var res = document.querySelector('[data-cms-link="reservation"]');
        if (res && data.contact && data.contact.reservation_url) {
          res.setAttribute('href', data.contact.reservation_url);
        }
      } catch (e) {
        console.warn('CMS apply error:', e);
      }
    })
    .catch(function(e){ console.warn('CMS content fetch failed:', e); });
})();
