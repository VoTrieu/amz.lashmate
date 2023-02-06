import { DataTableRowExpansionTemplate } from "primereact/datatable";
import { ReactNode } from "react";

export default interface IDataTableProp {
  paginatorOptions: {
    TotalPage: number;
    PageIndex: number;
    PageSize: number;
    TotalRow: number;
  };
  dataKey: string;
  data: [];
  fnGetData: (pageSize?: number, pageIndex?: number, searchText?: string) => void;
  deleteSelectedItem: <T>(selectedItem: T) => void;
  createNewItem: () => void;
  fnGetAllDataForExport: (searchText: string)=> File;
  excelFileName: string;
  title: string;
  excelExportable: boolean;
  updateItem: <T>(rowData: T) => void;
  rowExpansionTemplate: any;
  columns: {
    field: string;
    header: string;
    body: ReactNode;
    style: {};
  }[]

}
