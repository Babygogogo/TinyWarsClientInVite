import * as AuxiliaryTypesGridIndex from "./GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "./MapSize.ts";
import type * as AuxiliaryTypesMovableArea from "./MovableArea.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as TilesConstantsMapWeapon from "../tiles/constants/MapWeapon.ts";
import type * as TilesITile from "../tiles/ITile.ts";

type Data = {
    movePathDestination : AuxiliaryTypesGridIndex.GridIndex;
};

export class AttackableArea {
    private _area: Data[][];

    public constructor(area: Data[][]) {
        this._area = area;
    }
    public getArea(): Data[][] {
        return this._area;
    }
    public getColumn(x: number): Data[] | null {
        return this._area[x];
    }
    public getData(x: number, y: number): Data | null {
        const column = this._area[x];
        return column ? column[y] : null;
    }
    public getDataByGridIndex(gridIndex: AuxiliaryTypesGridIndex.GridIndex): Data | null {
        return this.getData(gridIndex.getX(), gridIndex.getY());
    }
    public checkHasGrid(x: number, y: number): boolean {
        return this.getData(x, y) != null;
    }
    public checkHasGridByGridIndex(gridIndex: AuxiliaryTypesGridIndex.GridIndex): boolean {
        return this.checkHasGrid(gridIndex.getX(), gridIndex.getY());
    }
    public clear(): void {
        this._area.length = 0;
    }

    public mergeFrom(area: AttackableArea, mapSize: AuxiliaryTypesMapSize.MapSize): void {
        const oldAreaData   = this.getArea();
        const newAreaData   = area.getArea();
        if (!oldAreaData.length) {
            this._area = newAreaData;
        } else {
            const { width, height } = mapSize.getWH();
            for (let x = 0; x < width; ++x) {
                if (newAreaData[x]) {
                    if (!oldAreaData[x]) {
                        oldAreaData[x] = newAreaData[x];
                    } else {
                        for (let y = 0; y < height; ++y) {
                            oldAreaData[x][y] ||= newAreaData[x][y];
                        }
                    }
                }
            }
        }
    }

    public static create({ movableArea, mapSize, minAttackRange, maxAttackRange, checkCanAttack }: {
        movableArea         : AuxiliaryTypesMovableArea.MovableArea;
        mapSize             : AuxiliaryTypesMapSize.MapSize;
        minAttackRange      : number | null;
        maxAttackRange      : number | null;
        checkCanAttack      : (destination: AuxiliaryTypesGridIndex.GridIndex, target: AuxiliaryTypesGridIndex.GridIndex) => boolean;
    }): AttackableArea {
        const area: Data[][] = [];
        if ((minAttackRange != null) && (maxAttackRange != null) && (maxAttackRange >= minAttackRange)) {
            const { width, height } = mapSize.getWH();
            for (let moveX = 0; moveX < width; ++moveX) {
                const column = movableArea.getColumn(moveX);
                if (column) {
                    for (let moveY = 0; moveY < height; ++moveY) {
                        const movableGrid = column[moveY];
                        if (movableGrid) {
                            const moveGridIndex = new AuxiliaryTypesGridIndex.GridIndex(moveX, moveY);
                            for (const attackGridIndex of moveGridIndex.getGridsWithinDistance({ minDistance: minAttackRange, maxDistance: maxAttackRange, mapSize })) {
                                const attackX = attackGridIndex.getX();
                                const attackY = attackGridIndex.getY();
                                if (checkCanAttack(moveGridIndex, attackGridIndex)) {
                                    area[attackX] = area[attackX] || [];
                                    const attackableGrid = area[attackX][attackY];
                                    if ((!attackableGrid)                                                                                                                   ||
                                        (movableGrid.totalMoveCost < HelpersMisc.getExisted(movableArea.getDataByGridIndex(attackableGrid.movePathDestination)).totalMoveCost)
                                    ) {
                                        area[attackX][attackY] = {
                                            movePathDestination: new AuxiliaryTypesGridIndex.GridIndex(moveX, moveY),
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return new AttackableArea(area);
    }

    public static createForTile(tile: TilesITile.ITile, mapSize: AuxiliaryTypesMapSize.MapSize): AttackableArea {
        const area          : Data[][] = [];
        const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
        const tileGridIndex = tile.getGridIndex();
        const tileGridX     = tileGridIndex.getX();
        const tileGridY     = tileGridIndex.getY();
        const mapWidth      = mapSize.getWidth();
        const mapHeight     = mapSize.getHeight();
        const addGrid       = (x: number, y: number) => {
            if (new AuxiliaryTypesGridIndex.GridIndex(x, y).checkIsInsideMap(mapSize)) {
                if (area[x] == null) {
                    area[x] = [];
                }
                area[x][y] = {
                    movePathDestination: new AuxiliaryTypesGridIndex.GridIndex(tileGridX, tileGridY),
                };
            }
        };

        if ((mapWeaponType === TilesConstantsMapWeapon.TypeId.Crystal) || (mapWeaponType === TilesConstantsMapWeapon.TypeId.CustomCrystal)) {
            for (const gridIndex of tileGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: HelpersMisc.getExisted(tile.getFinalCrystalData()).getRadius(), mapSize })) {
                addGrid(gridIndex.getX(), gridIndex.getY());
            }

        } else if ((mapWeaponType === TilesConstantsMapWeapon.TypeId.CustomCannon) || (tile.checkIsNormalCannon())) {
            const customCannonData  = HelpersMisc.getExisted(tile.getFinalCannonData());
            const rangeForDown      = customCannonData.getRangeForDown();
            const rangeForUp        = customCannonData.getRangeForUp();
            const rangeForLeft      = customCannonData.getRangeForLeft();
            const rangeForRight     = customCannonData.getRangeForRight();
            if (rangeForDown) {
                for (let deltaY = 1; deltaY <= rangeForDown; ++deltaY) {
                    const y = tileGridY + deltaY;
                    if (y >= mapHeight) {
                        break;
                    }
                    for (let deltaX = 1 - deltaY; deltaX <= deltaY - 1; ++deltaX) {
                        const x = tileGridX + deltaX;
                        if (x >= mapWidth) {
                            break;
                        }
                        addGrid(x, y);
                    }
                }
            }
            if (rangeForUp) {
                for (let deltaY = -rangeForUp; deltaY < 0; ++deltaY) {
                    const y = tileGridY + deltaY;
                    if (y >= mapHeight) {
                        break;
                    }
                    for (let deltaX = 1 + deltaY; deltaX <= -1 - deltaY; ++deltaX) {
                        const x = tileGridX + deltaX;
                        if (x >= mapWidth) {
                            break;
                        }
                        addGrid(x, y);
                    }
                }
            }
            if (rangeForRight) {
                for (let deltaX = 1; deltaX <= rangeForRight; ++deltaX) {
                    const x = tileGridX + deltaX;
                    if (x >= mapWidth) {
                        break;
                    }
                    for (let deltaY = 1 - deltaX; deltaY <= deltaX - 1; ++deltaY) {
                        const y = tileGridY + deltaY;
                        if (y >= mapHeight) {
                            break;
                        }
                        addGrid(x, y);
                    }
                }
            }
            if (rangeForLeft) {
                for (let deltaX = -rangeForLeft; deltaX < 0; ++deltaX) {
                    const x = tileGridX + deltaX;
                    if (x >= mapWidth) {
                        break;
                    }
                    for (let deltaY = 1 + deltaX; deltaY <= -1 - deltaX; ++deltaY) {
                        const y = tileGridY + deltaY;
                        if (y >= mapHeight) {
                            break;
                        }
                        addGrid(x, y);
                    }
                }
            }

        } else if ((mapWeaponType === TilesConstantsMapWeapon.TypeId.LaserTurret) || (mapWeaponType === TilesConstantsMapWeapon.TypeId.CustomLaserTurret)) {
            const customLaserTurretData = HelpersMisc.getExisted(tile.getFinalLaserTurretData());
            const rangeForDown          = customLaserTurretData.getRangeForDown();
            const rangeForUp            = customLaserTurretData.getRangeForUp();
            const rangeForLeft          = customLaserTurretData.getRangeForLeft();
            const rangeForRight         = customLaserTurretData.getRangeForRight();
            if (rangeForDown) {
                for (let deltaY = 0; deltaY < rangeForDown; ++deltaY) {
                    const y = tileGridY + deltaY + 1;
                    if (y >= mapHeight) {
                        break;
                    }
                    addGrid(tileGridX, y);
                }
            }
            if (rangeForUp) {
                for (let deltaY = 0; deltaY < rangeForUp; ++deltaY) {
                    const y = tileGridY - deltaY - 1;
                    if (y < 0) {
                        break;
                    }
                    addGrid(tileGridX, y);
                }
            }
            if (rangeForRight) {
                for (let deltaX = 0; deltaX < rangeForRight; ++deltaX) {
                    const x = tileGridX + deltaX + 1;
                    if (x >= mapWidth) {
                        break;
                    }
                    addGrid(x, tileGridY);
                }
            }
            if (rangeForLeft) {
                for (let deltaX = 0; deltaX < rangeForLeft; ++deltaX) {
                    const x = tileGridX - deltaX - 1;
                    if (x < 0) {
                        break;
                    }
                    addGrid(x, tileGridY);
                }
            }

        } else {
            // TODO: handle other tile types
            throw HelpersMisc.newError(`WarCommonHelpers.createAttackableAreaForTile() invalid mapWeaponType: ${mapWeaponType}`);
        }

        return new AttackableArea(area);
    }
}
