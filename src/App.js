import React, { useState } from 'react';
import './App.css';

class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }

  addChild(child) {
    if (this.children.length < 2) {
      this.children.push(child);
    } else {
      console.log('No se pueden agregar más de 2 nodos.');
    }
  }
}
class Tree {
  constructor() {
    this.root = null;
  }

  createRoot(value) {
    if (!this.root) {
      this.root = new TreeNode(value);
    } else {
      throw new Error('La raíz ya existe.');
    }
  }

  addNode(parentValue, value) {
    const parentNode = this.findNode(this.root, parentValue);
    if (parentNode) {
      parentNode.addChild(new TreeNode(value));
    } else {
      throw new Error('Nodo padre no encontrado o ya tiene 2 hijos.');
    }
  }

  findNode(node, value) {
    if (!node) return null;
    if (node.value === value) return node;
    for (let child of node.children) {
      const found = this.findNode(child, value);
      if (found) return found;
    }
    return null;
  }

  updateNode(oldValue, newValue) {
    const node = this.findNode(this.root, oldValue);
    if (node) {
      node.value = newValue;
    } else {
      throw new Error('Nodo no encontrado.');
    }
  }

  deleteNode(value) {
    if (!this.root) return;
    if (this.root.value === value) {
      this.root = null;
    } else {
      this._deleteNodeRecursively(this.root, value);
    }
  }

  _deleteNodeRecursively(node, value) {
    if (!node) return false;
    for (let i = 0; i < node.children.length; i++) {
      if (node.children[i].value === value) {
        node.children.splice(i, 1);
        return true;
      }
      if (this._deleteNodeRecursively(node.children[i], value)) return true;
    }
    return false;
  }

  traverse(node, callback) {
    if (!node) return;
    callback(node);
    node.children.forEach(child => this.traverse(child, callback));
  }
}

const App = () => {
  const [tree] = useState(new Tree());
  const [rootValue, setRootValue] = useState('');
  const [parentValue, setParentValue] = useState('');
  const [nodeValue, setNodeValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [nodeToUpdate, setNodeToUpdate] = useState('');
  const [traverseResult, setTraverseResult] = useState([]);
  const [nodeToDelete, setNodeToDelete] = useState('');

  const handleCreateRoot = () => {
    try {
      tree.createRoot(rootValue);
      setRootValue('');
      handleTraverse();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddNode = () => {
    try {
      tree.addNode(parentValue, nodeValue);
      setNodeValue('');
      setParentValue('');
      handleTraverse();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdateNode = () => {
    try {
      tree.updateNode(nodeToUpdate, newValue);
      setNodeToUpdate('');
      setNewValue('');
      handleTraverse();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteNode = () => {
    try {
      tree.deleteNode(nodeToDelete);
      setNodeToDelete('');
      handleTraverse();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleTraverse = () => {
    const result = [];
    tree.traverse(tree.root, (node) => result.push(node));
    setTraverseResult(result);
  };

  const renderNode = (node, depth) => {
    const color = depth === 0 ? 'yellow' : depth === 1 ? 'green' : 'blue';
    return (
      <li key={node.value} className="node-item" style={{ backgroundColor: color }}>
        {node.value}
        {node.children.length > 0 && (
          <ul>
            {node.children.map(child => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Tree Management</h1>

      <div className="input-section">
        <div className="input-group">
          <h2>Create Root</h2>
          <input
            type="text"
            value={rootValue}
            onChange={(e) => setRootValue(e.target.value)}
            placeholder="Root Value"
            className="input-field"
          />
          <button onClick={handleCreateRoot} className="action-button">Create Root</button>
        </div>

        <div className="input-group">
          <h2>Add Node</h2>
          <input
            type="text"
            value={parentValue}
            onChange={(e) => setParentValue(e.target.value)}
            placeholder="Parent Node"
            className="input-field"
          />
          <input
            type="text"
            value={nodeValue}
            onChange={(e) => setNodeValue(e.target.value)}
            placeholder="New Node"
            className="input-field"
          />
          <button onClick={handleAddNode} className="action-button">Add Node</button>
        </div>

        <div className="input-group">
          <h2>Update Node</h2>
          <input
            type="text"
            value={nodeToUpdate}
            onChange={(e) => setNodeToUpdate(e.target.value)}
            placeholder="Node to Update"
            className="input-field"
          />
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="New Value"
            className="input-field"
          />
          <button onClick={handleUpdateNode} className="action-button">Update Node</button>
        </div>

        <div className="input-group">
          <h2>Delete Node</h2>
          <input
            type="text"
            value={nodeToDelete}
            onChange={(e) => setNodeToDelete(e.target.value)}
            placeholder="Node to Delete"
            className="input-field"
          />
          <button onClick={handleDeleteNode} className="action-button delete-button">Delete Node</button>
        </div>

        <div className="tree-display">
          <h2>Tree Nodes</h2>
          <button onClick={handleTraverse} className="action-button">Show Nodes</button>
          <ul className="node-list">
            {traverseResult.length > 0 ? (
              renderNode(traverseResult[0], 0)
            ) : (
              <li className="node-item">No nodes to display</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
