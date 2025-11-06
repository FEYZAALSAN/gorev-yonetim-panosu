// Bu, Next.js uygulamasının ana sayfasıdır ve Tailwind CSS ile tasarlanmıştır.

"use client"; // Bu komponent, client-side rendering kullanır

import React, { useEffect, useMemo, useState } from 'react';
import { useTodoStore } from '@/store/useTodoStore'; // Zustand Store'unuz
import { format } from 'date-fns'; // Tarih formatlama için (npm install date-fns komutuyla kurun)

// NOT: Tüm tip tanımlamaları (Todo, Status, Priority) useTodoStore'dan gelmektedir.

// ----------------------------------------------------
// Renk ve Durum Eşleştirmeleri (Görselinize göre ayarlandı)
// ----------------------------------------------------

const STATUS_COLORS = {
  TOTAL: 'bg-blue-600',
  COMPLETED: 'bg-green-600',
  IN_PROGRESS: 'bg-yellow-600',
  CANCELLED: 'bg-red-600',
  BEKLEYEN: 'bg-gray-500', 
};

const PRIORITY_CLASSES = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-blue-100 text-blue-700',
};

// Durum Tiplerinin Türkçe Karşılıkları
const STATUS_LABELS = {
    TOTAL: 'Toplam',
    COMPLETED: 'Tamamlandı',
    IN_PROGRESS: 'Devam Ediyor',
    CANCELLED: 'İptal Edildi',
    BEKLEYEN: 'Bekleyen',
};

const PRIORITY_LABELS = {
    HIGH: 'Yüksek',
    MEDIUM: 'Orta',
    LOW: 'Düşük',
};

// ----------------------------------------------------
// Alt Komponentler
// ----------------------------------------------------

// Görev İstatistik Kartı
const StatCard = ({ label, count, color }) => (
  <div 
    className="bg-white p-4 rounded-xl shadow-md border-t-4"
    style={{ borderTopColor: color }}
  >
    <div className="text-3xl font-bold text-gray-900">{count}</div>
    <p className="text-sm font-medium text-gray-500 mt-1 truncate">{label}</p>
  </div>
);

// Tek bir Görev Kartı
const TodoCard = ({ todo }) => {
  const { updateTodo, deleteTodo, loading } = useTodoStore();
  
  const priorityClass = PRIORITY_CLASSES[todo.priority] || PRIORITY_CLASSES.LOW;

  const handleStatusChange = (e) => {
    // PUT isteği ile sadece status alanını günceller.
    updateTodo(todo.id, { status: e.target.value });
  };

  const handleDelete = () => {
    if (window.confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      deleteTodo(todo.id);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{todo.title}</h3>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${priorityClass}`}>
          {PRIORITY_LABELS[todo.priority] || 'Düşük'}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4">{todo.description || 'Açıklama yok'}</p>
      
      <div className="flex justify-between items-center text-sm">
        {/* Durum Güncelleme Alanı */}
        <select
          value={todo.status}
          onChange={handleStatusChange}
          disabled={loading}
          className={`px-2 py-1 rounded-lg border-2 appearance-none cursor-pointer text-sm 
            ${todo.status === 'COMPLETED' ? 'border-green-500 text-green-700 bg-green-50' :
              todo.status === 'IN_PROGRESS' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
              todo.status === 'BEKLEYEN' ? 'border-gray-500 text-gray-700 bg-gray-50' :
              'border-red-500 text-red-700 bg-red-50'
            }`}
        >
          {/* Değerler (value) Zustand Store ve Prisma tipleriyle aynı olmalı */}
          <option value="IN_PROGRESS">{STATUS_LABELS.IN_PROGRESS}</option>
          <option value="COMPLETED">{STATUS_LABELS.COMPLETED}</option>
          <option value="BEKLEYEN">{STATUS_LABELS.BEKLEYEN}</option> 
          <option value="CANCELLED">{STATUS_LABELS.CANCELLED}</option>
        </select>
        
        <div className="flex space-x-3">
          {/* todo.createdAt bir dize olduğu için format'ı kullanırken yeni Date nesnesi oluşturuyoruz */}
          <span className="text-xs text-gray-400 self-center">
            Oluşturulma: {format(new Date(todo.createdAt), 'dd/MM/yyyy')}
          </span>
          {/* Silme butonu */}
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition duration-150"
            title="Görevi Sil"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

// Yeni Görev Ekleme Formu
const AddTodoForm = () => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('LOW');
  const { addTodo, loading } = useTodoStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Varsayılan durum: BEKLEYEN
    await addTodo({ title: title.trim(), priority, status: 'BEKLEYEN' });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Yeni Görev Ekle</h2>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Yeni görev başlığını girin..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
          required
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
          disabled={loading}
        >
            <option value="LOW">{PRIORITY_LABELS.LOW}</option>
            <option value="MEDIUM">{PRIORITY_LABELS.MEDIUM}</option>
            <option value="HIGH">{PRIORITY_LABELS.HIGH}</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 w-full sm:w-auto disabled:opacity-50"
          disabled={loading || !title.trim()}
        >
          + Yeni Görev
        </button>
      </div>
    </form>
  );
};


// ----------------------------------------------------
// ANA KOMPONENT (PAGE) - En Basit Dışa Aktarma Yapısı
// ----------------------------------------------------

const TodoDashboardPage = () => {
  const { todos, loading, error, fetchTodos } = useTodoStore();
  
  // Sayfa yüklendiğinde görevleri API'den çek
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // İSTATİSTİKLERİN HESAPLANMASI
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.status === 'COMPLETED').length;
    const inProgress = todos.filter(t => t.status === 'IN_PROGRESS').length;
    const highPriority = todos.filter(t => t.priority === 'HIGH').length;
    const pending = todos.filter(t => t.status === 'BEKLEYEN').length;

    return [
      { label: STATUS_LABELS.TOTAL, count: total, color: STATUS_COLORS.TOTAL },
      { label: STATUS_LABELS.COMPLETED, count: completed, color: STATUS_COLORS.COMPLETED },
      { label: STATUS_LABELS.IN_PROGRESS, count: inProgress, color: STATUS_COLORS.IN_PROGRESS },
      { label: STATUS_LABELS.BEKLEYEN, count: pending, color: STATUS_COLORS.BEKLEYEN },
      { label: `Öncelik: ${PRIORITY_LABELS.HIGH}`, count: highPriority, color: STATUS_COLORS.CANCELLED },
    ];
  }, [todos]);
  
  // Yüklenme veya Hata Durumu
  if (loading && todos.length === 0) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <p className="text-lg text-blue-600">Görevler yükleniyor...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <header className="max-w-7xl mx-auto py-6">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          TaskiFlow <span className="ml-2 text-xl font-medium text-gray-500">Görev Panosu</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500">Görevlerinizi yönetin ve takip edin. (Veri kaynağı: MongoDB)</p>
      </header>

      <main className="max-w-7xl mx-auto">
        
        {/* Hata Mesajı */}
        {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                Hata oluştu: {error}. Sayfayı yenileyin veya konsolu kontrol edin.
            </div>
        )}

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              label={stat.label} 
              count={stat.count} 
              color={stat.color} 
            />
          ))}
        </div>

        {/* Yeni Görev Ekleme Alanı */}
        <AddTodoForm />

        {/* Görev Listesi Başlığı */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Tüm Görevler ({todos.length})</h2>
            {loading && <p className="text-sm text-blue-600">Güncelleniyor...</p>}
        </div>
        
        {/* Todo Kartları Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {todos.length === 0 && !loading ? (
            <p className="col-span-full text-center text-gray-500 py-10 border border-dashed rounded-xl">
              Henüz eklenmiş bir görev yok. Yeni bir görev ekleyerek başlayın!
            </p>
          ) : (
            todos.map((todo) => (
              <TodoCard 
                key={todo.id} 
                todo={todo} 
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};
export default TodoDashboardPage;