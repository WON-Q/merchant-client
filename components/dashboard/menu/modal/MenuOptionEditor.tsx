import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MenuOptionGroup } from "@/app/api/dashboard/menu/route";

/**
 * 옵션 에디터 컴포넌트의 props 인터페이스
 */
interface OptionEditorProps {
  /**
   * 메뉴 옵션 그룹 목록
   */
  optionGroups: MenuOptionGroup[];

  /**
   * 새 옵션 그룹 추가 핸들러
   */
  onAddOptionGroup: () => void;

  /**
   * 옵션 그룹 삭제 핸들러
   */
  onRemoveOptionGroup: (groupIndex: number) => void;

  /**
   * 옵션 그룹명 변경 핸들러
   */
  onOptionGroupNameChange: (groupIndex: number, name: string) => void;

  /**
   * 옵션 추가 핸들러
   */
  onAddOption: (groupIndex: number) => void;

  /**
   * 옵션 삭제 핸들러
   */
  onRemoveOption: (groupIndex: number, optionIndex: number) => void;

  /**
   * 옵션명 변경 핸들러
   */
  onOptionNameChange: (
    groupIndex: number,
    optionIndex: number,
    name: string
  ) => void;

  /**
   * 옵션 가격 변경 핸들러
   */
  onOptionPriceChange: (
    groupIndex: number,
    optionIndex: number,
    price: number
  ) => void;
}

/**
 * 메뉴 옵션 편집기 컴포넌트
 */
export default function MenuOptionEditor({
  optionGroups,
  onAddOptionGroup,
  onRemoveOptionGroup,
  onOptionGroupNameChange,
  onAddOption,
  onRemoveOption,
  onOptionNameChange,
  onOptionPriceChange,
}: OptionEditorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-medium text-gray-700">옵션 설정</div>
          <p className="text-sm text-neutral-500">
            고객이 선택할 수 있는 옵션을 추가하세요
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddOptionGroup}
          className="h-9 px-4 min-w-[100px]"
        >
          옵션 추가
        </Button>
      </div>

      {optionGroups.length === 0 ? (
        <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
          <div className="bg-neutral-100 rounded-full p-3 mb-4">
            <Plus className="h-6 w-6 text-neutral-500" />
          </div>
          <h3 className="font-medium mb-1">옵션 추가하기</h3>
          <p className="text-sm text-neutral-500 mb-4">
            아직 추가된 옵션이 없습니다. 사이즈, 맵기, 토핑 등의 옵션을
            추가해보세요.
          </p>
          <Button onClick={onAddOptionGroup} className="h-9 px-4 min-w-[100px]">
            첫 옵션 추가
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {optionGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="border rounded-md p-4 bg-white">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="text-lg font-medium text-[#FF6B35] min-w-7">
                    {groupIndex + 1}.
                  </div>
                  <Input
                    value={group.groupName}
                    onChange={(e) =>
                      onOptionGroupNameChange(groupIndex, e.target.value)
                    }
                    placeholder={`옵션 ${groupIndex + 1}`}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 text-neutral-500 hover:text-red-500 ml-2 shrink-0"
                  onClick={() => onRemoveOptionGroup(groupIndex)}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">삭제</span>
                </Button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="text-sm font-medium text-gray-700">
                  옵션 목록
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 mb-1">
                    <div className="col-span-8 text-xs text-neutral-500 font-medium px-2">
                      옵션명
                    </div>
                    <div className="col-span-4 text-xs text-neutral-500 font-medium px-2">
                      추가 가격
                    </div>
                  </div>

                  {group.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="grid grid-cols-12 gap-2">
                      <div className="col-span-8">
                        <Input
                          value={option.optionName}
                          onChange={(e) =>
                            onOptionNameChange(
                              groupIndex,
                              optionIndex,
                              e.target.value
                            )
                          }
                          placeholder={`옵션 ${optionIndex + 1}`}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          value={option.optionPrice}
                          onChange={(e) =>
                            onOptionPriceChange(
                              groupIndex,
                              optionIndex,
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          rightIcon={
                            <span className="text-xs text-neutral-500">원</span>
                          }
                        />
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-9 w-9 text-neutral-500"
                          onClick={() =>
                            onRemoveOption(groupIndex, optionIndex)
                          }
                          disabled={group.options.length <= 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-9"
                  onClick={() => onAddOption(groupIndex)}
                >
                  옵션 추가
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
