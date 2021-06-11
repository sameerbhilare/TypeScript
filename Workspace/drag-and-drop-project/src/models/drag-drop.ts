// Drag & Drop interfaces
/*
    Drag and drop interfaces not just to define the structure of some objects
    but instead to really set up a contract which certain classes can assign to force these classes 
    to basically implement certain methods that help us with drag and drop.
*/

export interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

export interface DragTarget {
  // to basically signal the browser and JavaScript that the thing you're dragging something over is a valid drag target.
  // If you don't do the right thing in the drag over handler dropping will not be possible.
  dragOverHandler(event: DragEvent): void;

  // You need to drop Handler then to react to the actual drop that happens.
  // So if the drag over handler will permit to drop, and with the drop handler will handle the drop.
  // And then here we can update our data and UI, for example.
  dropHandler(event: DragEvent): void;

  // And to drag leave handler can be useful if we're, for example, giving some visual feedback to the user
  // when he or she drags something over the box, for example, we change the background color.
  // If no drop happens and instead it's cancelled or the user removes the element the way,
  // then we can use to drag leave handler to revert to our visual update.
  dragLeaveHandler(event: DragEvent): void;
}
