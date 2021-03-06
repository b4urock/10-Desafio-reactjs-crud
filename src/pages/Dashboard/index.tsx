import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      await api.get('/foods').then(response => {
        setFoods(response.data);
      });
    }
    loadFoods();
  }, [setFoods]);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // TODO ADD A NEW FOOD PLATE TO THE API
      const newId = foods[foods.length - 1]
        ? foods[foods.length - 1].id + 1
        : 1;
      const newFood = {
        id: newId,
        name: food.name,
        image: food.image,
        price: food.price,
        description: food.description,
        available: true,
      };

      await api.post('/foods', newFood).then(() => {
        setFoods([...foods, newFood]);
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    let editedFood = {
      ...food,
      id: editingFood.id,
      available: editingFood.available,
    };

    const editedFoodlist = foods.map(currentFood => {
      if (currentFood.id !== editingFood.id) {
        return currentFood;
      }
      editedFood = {
        ...food,
        id: editingFood.id,
        available: editingFood.available,
      };

      return editedFood;
    });

    await api.put(`/foods/${editedFood.id}`, editedFood);

    setFoods(editedFoodlist);
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // TODO DELETE A FOOD PLATE FROM THE API
    await api.delete(`/foods/${id}`);
    const newFoodList = foods.filter(currentFood => currentFood.id !== id);
    setFoods(newFoodList);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE
    setEditingFood(food);
    toggleEditModal();

    const editedFood = setEditingFood(food);
    return editedFood;
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
