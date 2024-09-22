<script setup lang="ts">

// ---------------------------------------------------------------------------------------------------------
// File upload

let dropHandler = undefined;
let dragEnterHandler = undefined;
let dragLeaveHandler = undefined;
let dragOverHandler = undefined;

onMounted(() => {
  const fileTempl = document.getElementById("file-template"),
      imageTempl = document.getElementById("image-template"),
      empty = document.getElementById("empty");

  // check if file is of type image and prepend the initialied
  // template to the target element
  function addFile(target, file) {
    const isImage = file.type.match("image.*"),
        objectURL = URL.createObjectURL(file);

    const clone = isImage
        ? imageTempl.content.cloneNode(true)
        : fileTempl.content.cloneNode(true);

    clone.querySelector("h1").textContent = file.name;
    clone.querySelector("li").id = objectURL;
    clone.querySelector(".delete").dataset.target = objectURL;
    clone.querySelector(".size").textContent =
        file.size > 1024
            ? file.size > 1048576
                ? Math.round(file.size / 1048576) + "mb"
                : Math.round(file.size / 1024) + "kb"
            : file.size + "b";

    isImage &&
    Object.assign(clone.querySelector("img"), {
      src: objectURL,
      alt: file.name
    });

    empty.classList.add("hidden");
    target.prepend(clone);

    FILES[objectURL] = file;
  }

  gallery = document.getElementById("gallery");
  const overlay = document.getElementById("overlay");

  // click the hidden input of type file if the visible button is clicked
  // and capture the selected files
  const hidden = document.getElementById("hidden-input");
  document.getElementById("button").onclick = () => hidden.click();
  hidden.onchange = (e) => {
    for (const file of e.target.files) {
      addFile(gallery, file);
    }
  };

  // use to check if a file is being dragged
  const hasFiles = (ev) => {
    return ev.dataTransfer.files.length > 0
  };

  // use to drag dragenter and dragleave events.
  // this is to know if the outermost parent is dragged over
  // without issues due to drag events on its children
  let counter = 0;

  // reset counter and append file to gallery when file is dropped
  dropHandler = (ev) => {
    console.log(ev)
    ev.preventDefault();
    for (const file of ev.dataTransfer.files) {
      addFile(gallery, file);
      overlay.classList.remove("draggedover");
      counter = 0;
    }
  }

  // only react to actual files being dragged
  dragEnterHandler = (e) => {
    e.preventDefault();
    if (!hasFiles(e)) {
      return;
    }
    ++counter && overlay.classList.add("draggedover");
  }

  dragLeaveHandler = (e) => {
    1 > --counter && overlay.classList.remove("draggedover");
  }

  dragOverHandler = (e) => {
    if (hasFiles(e)) {
      e.preventDefault();
    }
  }

  // event delegation to caputre delete events
  // fron the waste buckets in the file preview cards
  gallery.onclick = ({target}) => {
    if (target.classList.contains("delete")) {
      const ou = target.dataset.target;
      document.getElementById(ou).remove(ou);
      gallery.children.length === 1 && empty.classList.remove("hidden");
      delete FILES[ou];
    }
  };

  // clear entire selection
  // document.getElementById("cancel").onclick = () => {
  //   while (gallery.children.length > 0) {
  //     gallery.lastChild.remove();
  //   }
  //   FILES = {};
  //   empty.classList.remove("hidden");
  //   gallery.append(empty);
  // };

})

let removeImageFromFirestore = (ref) => {

  deleteObject(ref).then(() => {
    toast.add({
      title: 'Image supprimé',
      description: `L'image a été supprimé`,
      timeout: 6000,
      color: 'primary'
    })
    refreshImage()
  }).catch((error) => {
  });
}

let changeFavorite = (name) => {
  portee.favorite = name;
  submit();
}

</script>

<template>

</template>

<style scoped>

</style>
