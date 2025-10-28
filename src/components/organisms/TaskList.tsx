export const TaskList = () => {
  return (
    <main className="p-8 mx-8 mb-8 rounded-2xl mt-6" style={{ backgroundColor: 'rgba(17, 24, 39, 0.1)', backdropFilter: 'blur(2px)' }}>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Tasks</h2>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-600 text-lg">No active tasks yet</p>
          <p className="text-gray-500 text-sm mt-2">Click "+ Create Task" to get started</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Archived Tasks</h2>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-600 text-lg">No archived tasks</p>
        </div>
      </section>
    </main>
  );
};

