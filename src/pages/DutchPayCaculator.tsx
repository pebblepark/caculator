import {
  Calculator,
  Minus,
  Plus,
  Receipt,
  Scissors,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Calculation {
  baseAmount: number;
  extraAmount: number;
}

export default function DutchPayCalculator() {
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const [roundingUnit, setRoundingUnit] = useState<number>(100);
  const [calculation, setCalculation] = useState<Calculation>({
    baseAmount: 0,
    extraAmount: 0,
  });

  const totalAmountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (totalAmount) {
      calculateAmounts(parseFloat(totalAmount), peopleCount, roundingUnit);
    } else {
      setCalculation({ baseAmount: 0, extraAmount: 0 });
    }
  }, [totalAmount, peopleCount, roundingUnit]);

  const calculateAmounts = (
    total: number,
    count: number,
    roundingUnit: number
  ): void => {
    if (count === 0) return;

    const baseAmount = Math.floor(total / count / roundingUnit) * roundingUnit;
    const totalBaseAmount = baseAmount * count;
    const remainingAmount = total - totalBaseAmount;
    const extraAmount = remainingAmount > 0 ? baseAmount + remainingAmount : 0;

    setCalculation({ baseAmount, extraAmount });
  };

  const resetAll = (): void => {
    setTotalAmount("");
    setPeopleCount(2);
    setCalculation({ baseAmount: 0, extraAmount: 0 });
    // 인풋에 포커스
    setTimeout(() => {
      totalAmountInputRef.current?.focus();
    }, 0);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 ">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-8 h-8 mr-3" />
            <h1 className="text-2xl font-bold">더치페이 계산기</h1>
          </div>
          <p className="text-center text-green-100">
            함께 낸 비용을 공평하게 나눠보세요
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Total Amount Input */}
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Receipt className="w-4 h-4 inline mr-1" />총 금액
            </label>
            <div className="relative">
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="총 비용을 입력하세요"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                autoFocus
                ref={totalAmountInputRef} // ref 연결
              />
              <span className="absolute right-4 top-3 text-gray-500 text-lg">
                원
              </span>
            </div>
          </div>

          {/* People Count Input */}
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              참여 인원
            </label>
            <div className="flex items-center justify-center space-x-2">
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-2xl"
                onClick={() => setPeopleCount((prev) => Math.max(2, prev - 1))}
                aria-label="인원 감소"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="number"
                min={1}
                value={peopleCount}
                onChange={(e) => {
                  const value = Math.max(1, Number(e.target.value));
                  setPeopleCount(value);
                }}
                className="w-20 px-2 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-lg text-center"
                style={{ MozAppearance: "textfield" }}
              />
              <span className="text-lg font-bold">명</span>
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-2xl"
                onClick={() => setPeopleCount((prev) => prev + 1)}
                aria-label="인원 증가"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Rounding Unit Input */}
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Scissors className="w-4 h-4 inline mr-1" />
              절삭 단위
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 px-4 py-3 rounded-lg border-2 ${
                  roundingUnit === 100
                    ? "border-green-500 bg-green-100"
                    : "border-gray-200 bg-white"
                } font-semibold`}
                onClick={() => setRoundingUnit(100)}
              >
                백원
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-3 rounded-lg border-2 ${
                  roundingUnit === 1000
                    ? "border-green-500 bg-green-100"
                    : "border-gray-200 bg-white"
                } font-semibold`}
                onClick={() => setRoundingUnit(1000)}
              >
                천원
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-3 rounded-lg border-2 ${
                  roundingUnit === 10000
                    ? "border-green-500 bg-green-100"
                    : "border-gray-200 bg-white"
                } font-semibold`}
                onClick={() => setRoundingUnit(10000)}
              >
                만원
              </button>
            </div>
          </div>

          {/* Result */}
          {totalAmount && peopleCount > 0 && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calculator className="w-6 h-6 mr-2" />
                  <h3 className="text-xl font-bold">계산 결과</h3>
                </div>

                <div
                  className={`grid gap-4 mb-4 ${
                    calculation.extraAmount > 0 ? "grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  <div className="bg-white/30 rounded-lg p-4">
                    <div className="text-2xl font-bold mb-1">
                      {formatCurrency(calculation.baseAmount)}원
                    </div>
                    <div className="text-green-100 text-sm">1인당 금액</div>
                  </div>

                  {calculation.extraAmount > 0 && (
                    <div className="bg-orange-400/30 rounded-lg p-4">
                      <div className="text-2xl font-bold mb-1">
                        {formatCurrency(calculation.extraAmount)}원
                      </div>
                      <div className="text-green-100 text-sm">
                        추가 부담 1명
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-white/30 rounded-lg p-3">
                    <div className="text-green-100">총 금액</div>
                    <div className="font-semibold">
                      {formatCurrency(parseFloat(totalAmount) || 0)}원
                    </div>
                  </div>
                  <div className="bg-white/30 rounded-lg p-3">
                    <div className="text-green-100">참여 인원</div>
                    <div className="font-semibold">{peopleCount}명</div>
                  </div>
                  <div className="bg-white/30 rounded-lg p-3">
                    <div className="text-green-100">절삭 단위</div>
                    <div className="font-semibold">
                      {roundingUnit === 100 && "백원"}
                      {roundingUnit === 1000 && "천원"}
                      {roundingUnit === 10000 && "만원"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {totalAmount && peopleCount > 0 && (
            <button
              onClick={resetAll}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              tabIndex={6}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              초기화
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
