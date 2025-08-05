import {
  Calculator,
  DollarSign,
  Minus,
  Plus,
  Receipt,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Person {
  id: number;
  name: string;
  isSelected: boolean;
}

interface Calculation {
  baseAmount: number;
  extraAmount: number;
  extraPerPerson: number;
  totalExtraPayers: number;
}

export default function DutchPayCalculator() {
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: "사람 1", isSelected: true },
    { id: 2, name: "사람 2", isSelected: true },
  ]);
  const [nextId, setNextId] = useState<number>(3);
  const [selectedCount, setSelectedCount] = useState<number>(2);
  const [roundingOption, setRoundingOption] = useState<string>("100");
  const [extraPayerCount, setExtraPayerCount] = useState<number>(1);
  const [calculation, setCalculation] = useState<Calculation>({
    baseAmount: 0,
    extraAmount: 0,
    extraPerPerson: 0,
    totalExtraPayers: 0,
  });

  useEffect(() => {
    const selectedPeople = people.filter((person) => person.isSelected);
    setSelectedCount(selectedPeople.length);

    if (totalAmount && selectedPeople.length > 0) {
      calculateAmounts(
        parseFloat(totalAmount),
        selectedPeople.length,
        parseInt(roundingOption),
        extraPayerCount
      );
    } else {
      setCalculation({
        baseAmount: 0,
        extraAmount: 0,
        extraPerPerson: 0,
        totalExtraPayers: 0,
      });
    }
  }, [totalAmount, people, roundingOption, extraPayerCount]);

  const calculateAmounts = (
    total: number,
    count: number,
    roundingUnit: number,
    extraPayers: number
  ): void => {
    if (count === 0) return;

    const actualExtraPayers = Math.min(extraPayers, count);
    const baseAmount = Math.floor(total / count / roundingUnit) * roundingUnit;
    const totalBaseAmount = baseAmount * count;
    const remainingAmount = total - totalBaseAmount;
    const extraPerPerson =
      actualExtraPayers > 0
        ? Math.ceil(remainingAmount / actualExtraPayers)
        : 0;

    setCalculation({
      baseAmount,
      extraAmount: remainingAmount,
      extraPerPerson,
      totalExtraPayers: actualExtraPayers,
    });
  };

  const addPerson = (): void => {
    const newPerson: Person = {
      id: nextId,
      name: `사람 ${nextId}`,
      isSelected: true,
    };
    setPeople([...people, newPerson]);
    setNextId(nextId + 1);
  };

  const removePerson = (id: number): void => {
    if (people.length > 1) {
      setPeople(people.filter((person) => person.id !== id));
    }
  };

  const togglePersonSelection = (id: number): void => {
    setPeople(
      people.map((person) =>
        person.id === id
          ? { ...person, isSelected: !person.isSelected }
          : person
      )
    );
  };

  const updatePersonName = (id: number, newName: string): void => {
    setPeople(
      people.map((person) =>
        person.id === id ? { ...person, name: newName } : person
      )
    );
  };

  const resetAll = (): void => {
    setTotalAmount("");
    setPeople([
      { id: 1, name: "사람 1", isSelected: true },
      { id: 2, name: "사람 2", isSelected: true },
    ]);
    setNextId(3);
    setCalculation({
      baseAmount: 0,
      extraAmount: 0,
      extraPerPerson: 0,
      totalExtraPayers: 0,
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  const getRoundingUnitText = (unit: string): string => {
    switch (unit) {
      case "100":
        return "백원";
      case "1000":
        return "천원";
      case "10000":
        return "만원";
      default:
        return "백원";
    }
  };

  const selectedPeople = people.filter((person) => person.isSelected);
  const totalCalculated =
    calculation.baseAmount * selectedCount + calculation.extraAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
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
              />
              <span className="absolute right-4 top-3 text-gray-500 text-lg">
                원
              </span>
            </div>
          </div>

          {/* Rounding Options */}
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Settings className="w-4 h-4 inline mr-1" />
              절삭 단위 설정
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "100", label: "백원 단위" },
                { value: "1000", label: "천원 단위" },
                { value: "10000", label: "만원 단위" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setRoundingOption(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    roundingOption === option.value
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-200 hover:border-green-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Extra Payer Count Options */}
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <DollarSign className="w-4 h-4 inline mr-1" />
              추가 부담자 수 설정
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => setExtraPayerCount(count)}
                  disabled={count > selectedCount}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    extraPayerCount === count && count <= selectedCount
                      ? "bg-orange-500 text-white border-orange-500"
                      : count > selectedCount
                      ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"
                  }`}
                >
                  {count}명
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              선택한 수만큼의 참여자가 남은 금액을 추가로 부담합니다. (최대{" "}
              {selectedCount}명까지 선택 가능)
            </p>
          </div>

          {/* People List */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                <Users className="w-5 h-5 inline mr-2" />
                참여자 목록
              </h3>
              <button
                onClick={addPerson}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                title="사람 추가"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {people.map((person) => (
                <div
                  key={person.id}
                  className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                    person.isSelected
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-100 border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={person.isSelected}
                    onChange={() => togglePersonSelection(person.id)}
                    className="w-4 h-4 text-green-600 rounded mr-3"
                  />
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) =>
                      updatePersonName(person.id, e.target.value)
                    }
                    className="flex-1 px-3 py-2 bg-transparent border-none focus:outline-none font-medium"
                  />
                  {person.isSelected &&
                    selectedPeople.findIndex((p) => p.id === person.id) <
                      calculation.totalExtraPayers &&
                    calculation.extraAmount > 0 && (
                      <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full mr-2">
                        추가부담
                      </span>
                    )}
                  {people.length > 1 && (
                    <button
                      onClick={() => removePerson(person.id)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="삭제"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 text-sm text-gray-600 text-center">
              총 {people.length}명 중 {selectedCount}명 참여
            </div>
          </div>

          {/* Result */}
          {totalAmount && selectedCount > 0 && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calculator className="w-6 h-6 mr-2" />
                  <h3 className="text-xl font-bold">계산 결과</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="text-2xl font-bold mb-1">
                      {formatCurrency(calculation.baseAmount)}원
                    </div>
                    <div className="text-green-100 text-sm">
                      기본 1인당 금액
                    </div>
                  </div>

                  {calculation.extraAmount > 0 && (
                    <div className="bg-orange-400 bg-opacity-30 rounded-lg p-4">
                      <div className="text-2xl font-bold mb-1">
                        +{formatCurrency(calculation.extraPerPerson)}원
                      </div>
                      <div className="text-green-100 text-sm">
                        {calculation.totalExtraPayers}명이 추가 부담
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-white bg-opacity-10 rounded-lg p-3">
                    <div className="text-green-100">총 금액</div>
                    <div className="font-semibold">
                      {formatCurrency(parseFloat(totalAmount) || 0)}원
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-3">
                    <div className="text-green-100">참여 인원</div>
                    <div className="font-semibold">{selectedCount}명</div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-3">
                    <div className="text-green-100">절삭 단위</div>
                    <div className="font-semibold">
                      {getRoundingUnitText(roundingOption)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white bg-opacity-10 rounded-lg p-3">
                  <div className="text-sm text-green-100">
                    계산 검증: {formatCurrency(totalCalculated)}원 ={" "}
                    {formatCurrency(parseFloat(totalAmount) || 0)}원
                    <span className="ml-2 text-green-200">✓ 정확</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Individual Breakdown */}
          {totalAmount && selectedCount > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                개별 정산 내역
              </h3>
              <div className="space-y-2">
                {selectedPeople.map((person, index) => {
                  const isExtraPayer = index < calculation.totalExtraPayers;
                  const amount =
                    calculation.baseAmount +
                    (isExtraPayer ? calculation.extraPerPerson : 0);

                  return (
                    <div
                      key={person.id}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        isExtraPayer && calculation.extraAmount > 0
                          ? "bg-orange-50 border border-orange-200"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800">
                          {person.name}
                        </span>
                        {isExtraPayer && calculation.extraAmount > 0 && (
                          <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                            +{formatCurrency(calculation.extraPerPerson)}원
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                        <span
                          className={`font-bold ${
                            isExtraPayer && calculation.extraAmount > 0
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {formatCurrency(amount)}원
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {calculation.extraAmount > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    💡 <strong>상위 {calculation.totalExtraPayers}명</strong>이
                    각각 {formatCurrency(calculation.extraPerPerson)}원을 추가로
                    부담하여 전체 금액이 정확히 맞아떨어집니다.
                    {calculation.totalExtraPayers > 1 && (
                      <span className="block mt-1">
                        (총 추가 부담:{" "}
                        {formatCurrency(
                          calculation.extraPerPerson *
                            calculation.totalExtraPayers
                        )}
                        원)
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={resetAll}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
