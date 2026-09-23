export const scrollToSection = (targetId: string, offset = 0) => {
  if (targetId === 'about' || targetId === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    return;
  }

  const element = document.getElementById(targetId);
  if (element) {
    const yCoordinate = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({
      top: Math.max(0, yCoordinate - 70), // offset for fixed navbar
      behavior: 'smooth',
    });
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }
};
