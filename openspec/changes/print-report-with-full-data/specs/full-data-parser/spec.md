## ADDED Requirements

### Requirement: Parser SHALL extract descriptive metadata fields
`parsePrintPageText(text)` SHALL return a `meta` object alongside existing `data` object, containing all descriptive fields from the print page.

Required `meta` fields:
- `address` (string) — 地段位置或門牌
- `communityName` (string) — 社區名稱
- `transactionTarget` (string) — 交易標的
- `transactionDate` (string) — 交易日期（原始格式，如 108/12/31）
- `totalPriceRaw` (number) — 交易總價（元）
- `unitPricePerPing` (number) — 交易單價（元/坪）
- `totalArea` (number) — 交易總面積（坪）
- `mainBuildingRatio` (string) — 主建物佔比（如 58.07%）
- `buildingType` (string) — 建物型態
- `layout` (string) — 建物現況格局
- `mainUsage` (string) — 主要用途
- `management` (string) — 管理組織
- `hasElevator` (string) — 有無電梯
- `note` (string) — 備註
- `buildingMaterial` (string) — 主要建材
- `completionDate` (string) — 建築完成年月
- `parkingType` (string) — 車位類別
- `parkingFloor` (string) — 車位所在樓層

缺失欄位 SHALL 回傳空字串。

#### Scenario: Parse metadata from single-line format
- **WHEN** `parsePrintPageText` receives text containing `地段位置或門牌: 汐止區福德一路１７６巷００１５號四樓` and `社區名稱: 采采良品`
- **THEN** `result.meta.address` SHALL be `'汐止區福德一路１７６巷００１５號四樓'`
- **THEN** `result.meta.communityName` SHALL be `'采采良品'`

#### Scenario: Parse metadata from browser copy format (tab-separated)
- **WHEN** `parsePrintPageText` receives text with `地段位置或門牌:\t汐止區福德一路１７６巷００１５號四樓`
- **THEN** `result.meta.address` SHALL be `'汐止區福德一路１７６巷００１５號四樓'`

#### Scenario: Parse transaction details
- **WHEN** text contains `交易標的: 房地(土地+建物)+車位` and `交易日期: 108/12/31`
- **THEN** `result.meta.transactionTarget` SHALL be `'房地(土地+建物)+車位'`
- **THEN** `result.meta.transactionDate` SHALL be `'108/12/31'`

#### Scenario: Parse building info
- **WHEN** text contains `建物型態: 住宅大樓(11層含以上有電梯)` and `建物現況格局: 3房2廳2衛`
- **THEN** `result.meta.buildingType` SHALL be `'住宅大樓(11層含以上有電梯)'`
- **THEN** `result.meta.layout` SHALL be `'3房2廳2衛'`

#### Scenario: Parse building material and completion date
- **WHEN** text contains `鋼筋混凝土構造` and `111/10`
- **THEN** `result.meta.buildingMaterial` SHALL be `'鋼筋混凝土構造'`
- **THEN** `result.meta.completionDate` SHALL be `'111/10'`

#### Scenario: Parse parking details
- **WHEN** text contains parking section with `坡道平面` and `地下四樓`
- **THEN** `result.meta.parkingType` SHALL be `'坡道平面'`
- **THEN** `result.meta.parkingFloor` SHALL be `'地下四樓'`

#### Scenario: Parse note
- **WHEN** text contains `備註: 親友、員工、共有人或其他特殊關係間之交易;預售屋、或土地及建物分件登記案件;`
- **THEN** `result.meta.note` SHALL contain `'親友、員工、共有人或其他特殊關係間之交易'`

#### Scenario: Missing metadata fields default to empty string
- **WHEN** text does not contain `社區名稱` field
- **THEN** `result.meta.communityName` SHALL be `''`

### Requirement: Parser SHALL preserve backward compatibility
擴充後的 `parsePrintPageText` SHALL 維持現有 `data` 欄位結構不變。現有的 26 個測試 SHALL 全部通過。

#### Scenario: Existing data fields unchanged
- **WHEN** parser is called with existing test data
- **THEN** `result.data` SHALL contain all existing fields (mainBuildingArea, balconyArea, canopyArea, commonArea1, commonArea2, parkingArea, parkingPrice, unitPrice, landArea, currentFloor, floors, totalPrice, floorPremium, agePremium)
- **THEN** all existing tests SHALL pass

### Requirement: ImportDialog SHALL display metadata fields
`ImportDialog` SHALL display parsed metadata fields in a read-only summary section above the editable numeric fields. Metadata fields SHALL be editable as text inputs.

#### Scenario: Show metadata in preview
- **WHEN** user pastes text and clicks parse
- **THEN** dialog SHALL display address, community name, transaction date, building type, layout, and other metadata fields
- **THEN** metadata fields SHALL be editable text inputs

#### Scenario: Apply includes metadata
- **WHEN** user clicks "填入表單"
- **THEN** `onApply` callback SHALL receive both `data` and `meta` objects

### Requirement: ImportDialog SHALL support map image upload
`ImportDialog` SHALL include a file input for uploading a map screenshot image. The image SHALL be converted to a Data URL and included in the apply callback.

#### Scenario: Upload map image
- **WHEN** user selects an image file in the map upload input
- **THEN** dialog SHALL display a preview of the uploaded image
- **THEN** image SHALL be converted to Data URL

#### Scenario: Image size limit
- **WHEN** user selects an image larger than 2MB
- **THEN** dialog SHALL show an error message
- **THEN** image SHALL NOT be accepted

#### Scenario: No image uploaded
- **WHEN** user does not upload an image
- **THEN** `mapImageDataUrl` SHALL be `null` in the apply callback
