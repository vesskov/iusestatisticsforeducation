<?php
class ReadCsv{
	public $csvFile;
	private $table;
	public $sortColumn = 0;
	public $order;
	private $name;
	public $separator = ",";
	public $thousandsSeparator = ",";
	public $delimiter = ".";
	public $delete = array();
	private $text = '';
	private $lines = array();
	private $output = 'HTML';
	private $params = array();
	private $header = false;
	private $headerRows = array();
	private $bottomRow = array();
	private $options = array();
	private $csvAppend = "../images/CSV/";
	
	/**
	 * Sets class fields
	 */
	public function __construct($params) {
		$this->params = $params;
		$this->csvFile = $this->csvAppend.$params['csvFile'];
		$this->sortColumn = $params['sortColumn'];
		$this->order = $params['order']-1;
		$this->delete = preg_split('/:/', $params['delete']);
		if ($params['output'] == 'CSV') {
			$this->output = 'CSV';  
		}
		
		if ( isset($params['csvInput']) ) {
			$this->text = $params['csvInput'];
		} 
		
		$this->setName();
		$this->readCSV();
	}
	/**
	 * Reads CSV input  
	 * 
	 * @name readCSV
	 */
	private function readCSV() {
		if ($this->text == '' AND is_file($this->csvFile)) 
			$this->text = file_get_contents(($this->csvFile));
		if (substr_count($this->text, ';') > substr_count($this->text, ',')) {
			$this -> separator = ';';
			$this -> delimiter = ',';
			$this -> thousandsSeparator = "\.";
		}
		$this->lines = preg_split('/\r\n|\n|\r/', $this->text);
		$this->generateOutput();			
	}
	
	private function generateOutput() {
		$csvMapLines = array();	
		$count = 0;		
		$datalines = 0;
		foreach ($this->lines as $line) {
			$values = preg_split("/".$this->separator."/", $line);
			if ($count == 0 AND $values[1]=="") {
				$this->header = $values[0];	
				$headRow[$count] = $headerLines[$count] = 	$line;
			} else if (($count == 0 AND !$this->header) OR ($count == 1 AND $this->header)) {
				$headRow[$count] = $headerLines[$count] = $line;
				$this->options = $values;
			} else if ($count > 2 && count(array_filter($values)) == 1 ) {		
				$this->bottomRow[$count] = $line;
			} else {
				$array_check[0] = $datalines;				
				if (!array_intersect($array_check, $this->delete)) {
					if (preg_match('/[\.,]/', $values[$this->sortColumn])) {
						$sortValue = preg_replace('/'.$this->thousandsSeparator.'/', '', $values[$this->sortColumn]);
						$sortValue *= 1000;
						$csvMapLines[] = array('sort' => $sortValue*1000, 'line' => $line, 'linenumber' => $count);// 	
					}else{
						$sortValue = $values[$this->sortColumn];
						$sortValue = preg_replace("/".$result->thousandsSeparator."/", "", $sortValue);
						$csvMapLines[] = array('sort' => $sortValue.' ', 'line' => $line, 'linenumber' => $count);// 			
					}
                    $new_lines[] = $line;
				}
				$datalines++;
			}
			$count++;	
		}
        
		$this->lines = $new_lines;
        $this->headerRows = $headerLines;
		
		//print_r($csvMapLines);
		if ($this->order == 0)
			sort($csvMapLines);
		else if ($this->order == 1)
			rsort($csvMapLines);
		
		$counRealLines = 1;
		foreach($csvMapLines as $line) {
			//$class = $this->defineClass($counRealLines);
			if ($this->output == 'CSV') {
				$htmlRows[] = $line['line'];
			}
			$counRealLines++; 
		}
		
		if ($this->output == 'CSV') {
			$this->constructCSVOutput($headRow, $htmlRows);
		}
	}
	
	public function getCSVLines() {
		//echo "order", $this->order, "column", $this->sortColumn;
		//print_r($this->lines);
		return $this->lines;
	}	

	public function getBottomRow() {
		return $this->bottomRow;	
	}
	
	public function getOptions() {
		return $this->options;		
	}
	
	public function getHeader() {
		return $this->header;
	}

	public function getParams() {
		//echo "order", $this->order, "column", $this->sortColumn;
		//print_r($this->delete);
		return $this->params;
	}
	
	public function setText($text) {
		$this->text = $text;
	}
	
	private function setName() {
		//echo $this->csvFile."Tuk sme";
		$name = preg_replace('/[^a-z0-9]/i',' ', $this->csvFile);
		$name = preg_replace('/csv/', '', $name);
		$name = preg_replace('/CSV/', '', $name);
		$name = preg_replace('/images/', '', $name);
		$this->name = $name;
	}
	
	public function getName() {
		if ($this->header)
			return $this->header;
		return $this->name;
	}
	
	public function getHeaderSpan() {
		$html = trim($this->name);
		if ($this->header)
			$html = trim($this->header);
		
		$zero_element = preg_split("/[\s,]+/", $html);
		return preg_replace("/".$zero_element[0]."/", "<span>".$zero_element[0]."</span>", $html);
	}

	public function returnJson() {
		$values = array(
			'headlines' => array(),
			'datalines' => array(),
			'bottomlines' => array()
		);
		
		if (is_array($this->headerRows))
			foreach ($this->headerRows as $line) 
				$values['headlines'][] = preg_split("/".$this->separator."/", trim($line));
			
		if (is_array($this->bottomRow))
			foreach ($this->bottomRow as $line)
				$values['bottomlines'][] = preg_split("/".$this->separator."/", trim($line));

		if (is_array($this->lines))
			foreach ($this->lines as $line) 
				$values['datalines'][] = preg_split("/".$this->separator."/", trim($line));	
		
		return json_encode($values);
	}
}
