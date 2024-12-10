let nodeId = 0; 
let nodes = []; 
const container = document.getElementById('container');
const svg = document.getElementById('svg');

document.getElementById('addNode').addEventListener('click', () => {
  if (nodes.length === 0) {
    createNode('Master', 100, 100);
    document.getElementById('addNode').style.display = 'none'; 

  }
});

function createNode(label, x, y, parentNode = null) {
  const node = document.createElement('div');
  node.className = 'node';
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.id = `node-${++nodeId}`;

  node.innerHTML = `
    <p>${label}</p>
    <div class="actions">
      <button class="remove">-</button>
      <button class="add">+</button>
    </div>
  `;

  container.appendChild(node);

  if (parentNode) {
    connectNodes(parentNode, node);
    node.dataset.parentId = parentNode.id; 
  }

  addDraggable(node);
  addActions(node);
  nodes.push({ id: nodeId, element: node });
  updateAddNodeButton();
}

function addActions(node) {
    const addButton = node.querySelector('.add');
    const removeButton = node.querySelector('.remove');
  
    addButton.addEventListener('click', (e) => {
    
      const existingOptions = document.querySelector('.options');
      if (existingOptions) {
        existingOptions.remove();
      }
  
     
      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'options';
  
      const choices = ['Alpha', 'Beta', 'Sigma'];
      choices.forEach(choice => {
        const option = document.createElement('button');
        option.textContent = choice;
        option.addEventListener('click', () => {
          createNode(choice, parseInt(node.style.left) + 100, parseInt(node.style.top) + 50, node);
          optionsContainer.remove(); 
        });
        optionsContainer.appendChild(option);
      });
  
      
      document.body.appendChild(optionsContainer);
  

      setTimeout(() => {
        optionsContainer.classList.add('show'); 
      }, 10);
  
     
      document.addEventListener('click', function closeOptions(event) {
        if (!node.contains(event.target) && !optionsContainer.contains(event.target)) {
          optionsContainer.classList.remove('show');
          setTimeout(() => {
            optionsContainer.remove(); 
          }, 100); 
          document.removeEventListener('click', closeOptions); 
        }
      });
    });
  
    removeButton.addEventListener('click', () => {
      removeNode(node);
    });
  }
  
  function removeNode(node) {
    const nodeId = parseInt(node.id.split('-')[1]);
    const childNodes = getChildNodes(nodeId); 
    childNodes.forEach(childNode => {
      const childElement = document.getElementById(`node-${childNode.id}`);
      if (childElement) {
        childElement.remove();
      }
      nodes = nodes.filter(n => n.id !== childNode.id);
    });
  
   
    node.remove();
    nodes = nodes.filter(n => n.id !== nodeId);
  
    updateConnections();
    updateAddNodeButton();
  }
  
 
  function getChildNodes(parentId) {
    const directChildren = nodes.filter(n => n.element.dataset.parentId === `node-${parentId}`);
    let allChildren = [...directChildren];
  
    directChildren.forEach(child => {
      allChildren = allChildren.concat(getChildNodes(child.id)); 
    });
  
    return allChildren;
  }
  

function addDraggable(node) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  node.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - node.offsetLeft;
    offsetY = e.clientY - node.offsetTop;
    node.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      node.style.left = `${e.clientX - offsetX}px`;
      node.style.top = `${e.clientY - offsetY}px`;
      updateConnections();
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    node.style.cursor = 'grab';
  });
}
function connectNodes(node1, node2) {
  const x1 = node1.offsetLeft + node1.offsetWidth / 2;
  const y1 = node1.offsetTop + node1.offsetHeight / 2;
  const x2 = node2.offsetLeft + node2.offsetWidth / 2;
  const y2 = node2.offsetTop + node2.offsetHeight / 2;


  const controlX = (x1 + x2) / 2; 
  const controlY = y1 < y2 ? y1 - 50 : y2 - 50; 

  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    `M ${x1},${y1} Q ${controlX},${controlY} ${x2},${y2}` 
  );
  path.setAttribute('stroke', 'tomato');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('fill', 'none');

  svg.appendChild(path);
}

function updateConnections() {
  
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  
  nodes.forEach(({ element }) => {
    const parentId = element.dataset.parentId;
    if (parentId) {
      const parent = document.getElementById(parentId);
      if (parent) {
        connectNodes(parent, element);
      }
    }
  });
}

function updateAddNodeButton() {
  const addNodeButton = document.getElementById('addNode');
  addNodeButton.style.display = nodes.length === 0 ? 'block' : 'none'; اري
}
