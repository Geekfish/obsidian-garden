document.addEventListener("DOMContentLoaded", () => {
  const photos = [...document.querySelectorAll(".photo-album p > img")];
  if (photos.length === 0) return;

  const dialog = document.createElement("dialog");
  dialog.className = "photo-lightbox";
  const image = document.createElement("img");
  dialog.append(image);
  document.body.append(dialog);

  let current = 0;
  const show = (index) => {
    current = (index + photos.length) % photos.length;
    image.src = photos[current].src;
    image.alt = photos[current].alt;
  };

  photos.forEach((photo, index) => {
    photo.addEventListener("click", () => {
      show(index);
      dialog.showModal();
    });
  });
  dialog.addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") show(current + 1);
    if (event.key === "ArrowLeft") show(current - 1);
  });
});
