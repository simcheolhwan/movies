interface FilterItem {
  to: LocationDescriptor
  isSelected: boolean
}

interface Genre extends FilterItem {
  label: string
  icon?: ReactNode
  count?: number
  isMenu?: boolean
}

interface Year extends FilterItem {
  year: number
}
