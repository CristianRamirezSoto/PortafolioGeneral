 document.addEventListener('DOMContentLoaded', () => {
    const btnCert = document.getElementById('btnCertificados');
    const modalCert = document.getElementById('modalCertificados');
    if(!btnCert || !modalCert) return;

    const openModal = () => {
      modalCert.classList.remove('hidden');
      modalCert.setAttribute('aria-hidden', 'false');
      // bloquea scroll del body
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
      modalCert.classList.add('hidden');
      modalCert.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    btnCert.addEventListener('click', openModal);
    modalCert.querySelectorAll('[data-close="cert"]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && !modalCert.classList.contains('hidden')) closeModal(); });
  });