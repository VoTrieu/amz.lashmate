import { Fragment, useState, useEffect, useRef, FC, ChangeEvent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
import classes from "./Table.module.scss";
import IDataTableProp from "../../interfaces/DataTableProp";

const AppDataTable:FC<IDataTableProp> = (props) => {
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [expandedRows, setExpandedRows] = useState<any>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [isFirstRender, setIsFirstRender] = useState(true);
  const { TotalPage, PageIndex, PageSize, TotalRow } =
    props.paginatorOptions || {
      TotalPage: 0,
      PageIndex: 1,
      PageSize: 10,
    };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputTooltip, setPageInputTooltip] = useState(
    "Nhấn phím 'Enter' để đi tới trang này."
  );

  const [first, setFirst] = useState<number>();
  const [rows, setRows] = useState<number>(PageSize);
  const paginatorRef = useRef<Paginator>(null);

  useEffect(() => {
    fetchData();
  }, []);

  //update page size
  useEffect(() => {
    const _first = (PageIndex - 1) * PageSize;
    setFirst(_first);
  }, [PageIndex, PageSize]);

  //search data from backend
  useEffect(() => {
    if (isFirstRender) {
      //prevent from getting data twice at beginning
      return setIsFirstRender(false);
    }

    //Timeout to wait for user finish typing
    let timer = setTimeout(() => {
      fetchData(rows, 1, searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  const fetchData = (pageSize?: number, pageIndex?: number, searchText?: string) => {
    props.fnGetData(pageSize, pageIndex, searchText);
  };

  const deleteSelectedItem = () => {
    props.deleteSelectedItem(selectedItem);
    hideDeleteItemDialog();
    setSelectedItem(null);
  };

  const hideDeleteItemDialog = () => {
    setDeleteItemDialog(false);
  };

  const showDeleteItemDialog = <T,>(rowData: T) => {
    setDeleteItemDialog(true);
    setSelectedItem(rowData);
  };

  const createNewItem = () => {
    props.createNewItem();
  };

  const header = (
    <div className="table-header flex flex-column md:flex-row justify-content-between align-items-center">
      <div>
        <h3>{props.title}</h3>
      </div>
      <div className="flex flex-column md:flex-row align-items-center justify-content-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setSearchText(e.currentTarget.value)}
            placeholder="Tìm kiếm..."
          />
        </span>

        {/* {!props.isHideCreateButton && ( */}
          <Button
            label="Thêm mới"
            icon="pi pi-plus"
            className="p-button-success ml-4 mt-2 md:mt-0"
            onClick={createNewItem}
          />
        {/* )} */}
      </div>
    </div>
  );

  const actionBodyTemplate = <T,>(rowData: T) => {
    return (
      <Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => {
            props.updateItem(rowData);
          }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mr-2"
          onClick={() => showDeleteItemDialog(rowData)}
        />
        {/* {props.isPrintAble && (
          <Button
            icon="pi pi-print"
            className="p-button-rounded p-button-secondary"
            onClick={() => props.showPrintModal(rowData.OrderId)}
          />
        )} */}
      </Fragment>
    );
  };

  const deleteItemDialogFooter = (
    <Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteItemDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedItem}
      />
    </Fragment>
  );

  const onPageInputKeyDown = (event: any, options: any) => {
    if (event.key === "Enter") {
      const page = currentPage;
      if (page < 1 || page > options.totalPages) {
        setPageInputTooltip(
          `Value must be between 1 and ${options.totalPages}.`
        );
      } else {
        const first = currentPage ? options.rows * (page - 1) : 0;
        setFirst(first);
        setPageInputTooltip("Nhấn phím 'Enter' để đi tới trang này.");
        fetchData(rows, page);
      }
    }
  };

  const onPageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputedPage = event.target.value;
    setCurrentPage(+inputedPage);
  };

  const onPaginatorChange = (options: any) => {
    setRows(options.rows);
    fetchData(options.rows, options.page + 1, searchText);
  };

  const paginatorTemplate = {
    layout:
      "PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport",
    PrevPageLink: (options:any) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">Previous</span>
          <Ripple />
        </button>
      );
    },
    NextPageLink: (options:any) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">Next</span>
          <Ripple />
        </button>
      );
    },
    PageLinks: (options:any) => {
      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        const className = classNames(options.className, { "p-disabled": true });

        return (
          <span className={className} style={{ userSelect: "none" }}>
            ...
          </span>
        );
      }

      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
        >
          {options.page + 1}
          <Ripple />
        </button>
      );
    },
    RowsPerPageDropdown: (options: any) => {
      const dropdownOptions = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
      ];

      return (
        <Dropdown
          value={options.value}
          options={dropdownOptions}
          onChange={options.onChange}
        />
      );
    },
    CurrentPageReport: (options: any) => {
      return (
        <Fragment>
          <span
            className="mx-3"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Go to
            <InputText
              size={3}
              className="ml-1"
              value={currentPage.toString()}
              tooltip={pageInputTooltip}
              onKeyDown={(e) => onPageInputKeyDown(e, options)}
              onChange={onPageInputChange}
            />
          </span>
          <span style={{ color: "var(--text-color)" }}>of {TotalPage}</span>
        </Fragment>
      );
    },
  };

  return (
    <Fragment>
      <div className="card">
        <DataTable
          className={classes.app_table}
          value={props.data}
          dataKey={props.dataKey}
          header={header}
          stripedRows
          resizableColumns
          responsiveLayout="stack"
          breakpoint="960px"
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={props.rowExpansionTemplate}
        >
          {props.rowExpansionTemplate && (
            <Column expander={true} style={{ width: "3em" }} />
          )}

          {props.columns.map((item) => (
            <Column
              key={item.field}
              field={item.field}
              body={item.body}
              header={item.header}
              sortable
              style={{
                minWidth: "12rem",
                wordBreak: "break-word",
                ...item.style
              }}
            ></Column>
          ))}

            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ 
                textAlign: "center",
                minWidth: "8rem"
               }}
            ></Column>
        </DataTable>
        <Paginator
          ref={paginatorRef}
          template={paginatorTemplate}
          first={first}
          rows={rows}
          totalRecords={TotalRow}
          onPageChange={onPaginatorChange}
        ></Paginator>
      </div>

      <Dialog
        visible={deleteItemDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteItemDialogFooter}
        onHide={hideDeleteItemDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedItem && <span>Bạn thật sự muốn xoá dữ liệu đã chọn?</span>}
        </div>
      </Dialog>
    </Fragment>
  );
};

export default AppDataTable;
