const SizeChart = () => {
  return (
    <div className="p-2">

      {/* Shirt Size Chart */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-800 mb-1">SHIRT</h2>
          <p className="text-gray-600 text-xs">All sizes are in inches.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-sm border">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="p-3 font-semibold text-left min-w-[100px]">
                  SIZE
                </th>
                <th className="p-3 font-semibold min-w-[50px]">S</th>
                <th className="p-3 font-semibold min-w-[50px]">M</th>
                <th className="p-3 font-semibold min-w-[50px]">L</th>
                <th className="p-3 font-semibold min-w-[50px]">XL</th>
                <th className="p-3 font-semibold min-w-[50px]">XXL</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 font-medium text-left">
                  SHOULDER
                </td>
                <td className="p-3">24</td>
                <td className="p-3">25.5</td>
                <td className="p-3">26</td>
                <td className="p-3">27.5</td>
                <td className="p-3">28</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 font-medium text-left">
                  CHEST
                </td>
                <td className="p-3">20</td>
                <td className="p-3">21</td>
                <td className="p-3">22</td>
                <td className="p-3">23</td>
                <td className="p-3">24</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 font-medium text-left">
                  SHIRT LENGTH
                </td>
                <td className="p-3">17</td>
                <td className="p-3">18</td>
                <td className="p-3">19</td>
                <td className="p-3">20</td>
                <td className="p-3">21</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium text-left">
                  SLEEVE LENGTH
                </td>
                <td className="p-3">5.5</td>
                <td className="p-3">6</td>
                <td className="p-3">6.5</td>
                <td className="p-3">7</td>
                <td className="p-3">7.5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Size Chart */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-800 mb-1">BOTTOM</h2>
          <p className="text-gray-600 text-xs">All sizes are in inches.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-sm border">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="p-3 font-semibold text-left min-w-[100px]">
                  SIZE
                </th>
                <th className="p-3 font-semibold min-w-[50px]">XS</th>
                <th className="p-3 font-semibold min-w-[50px]">S</th>
                <th className="p-3 font-semibold min-w-[50px]">M</th>
                <th className="p-3 font-semibold min-w-[50px]">L</th>
                <th className="p-3 font-semibold min-w-[50px]">XL</th>
                <th className="p-3 font-semibold min-w-[50px]">XXL</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 font-medium text-left">
                  WAIST
                </td>
                <td className="p-3">13.5</td>
                <td className="p-3">14.5</td>
                <td className="p-3">15.5</td>
                <td className="p-3">16.5</td>
                <td className="p-3">17.5</td>
                <td className="p-3">18.5</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 font-medium text-left">
                  HIPS
                </td>
                <td className="p-3">18</td>
                <td className="p-3">19</td>
                <td className="p-3">20</td>
                <td className="p-3">21</td>
                <td className="p-3">22</td>
                <td className="p-3">23</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium text-left">
                  PANT LENGTH
                </td>
                <td className="p-3">37.5</td>
                <td className="p-3">38</td>
                <td className="p-3">38.5</td>
                <td className="p-3">39</td>
                <td className="p-3">40</td>
                <td className="p-3">40</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SizeChart;
