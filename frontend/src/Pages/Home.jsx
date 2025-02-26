import TabsComponent from "../Component/TabsComponent";

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-700 text-center mt-8">
        🔍 Invisible Writing
      </h1>
      <hr className="border-t-2 border-gray-400 w-3/4 my-4" />

      <TabsComponent />
    </div>
  );
};

export default Home;
